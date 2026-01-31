package com.collectorshop.auth;

import com.collectorshop.shared.model.UserRole;
import com.collectorshop.user.UserAccount;
import com.collectorshop.user.UserAccountRepository;
import com.collectorshop.user.UserProfileResponse;
import com.collectorshop.user.UserProfileService;
import com.collectorshop.user.UserToken;
import com.collectorshop.user.UserTokenRepository;
import com.collectorshop.user.UserTokenType;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class AuthService {

    private static final Duration SESSION_TTL = Duration.ofDays(7);
    private static final Duration VERIFICATION_TTL = Duration.ofHours(24);
    private static final Duration RESET_TTL = Duration.ofHours(1);

    private final UserAccountRepository userAccountRepository;
    private final UserTokenRepository userTokenRepository;
    private final UserProfileService userProfileService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserAccountRepository userAccountRepository,
                       UserTokenRepository userTokenRepository,
                       UserProfileService userProfileService,
                       PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.userTokenRepository = userTokenRepository;
        this.userProfileService = userProfileService;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        if (Boolean.FALSE.equals(request.acceptedTerms())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Les conditions doivent être acceptées");
        }

        if (userAccountRepository.existsByEmailIgnoreCase(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cet email est déjà utilisé");
        }

        Set<UserRole> roles = resolveRoles(request.roles(), request.role());
        if (roles.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Au moins un rôle est requis");
        }

        UserAccount user = new UserAccount(
                request.email().trim().toLowerCase(Locale.ROOT),
                passwordEncoder.encode(request.password()),
                request.fullName().trim(),
                roles
        );
        user.setAcceptedTermsAt(Instant.now());
        userAccountRepository.save(user);

        UserToken verification = createToken(user, UserTokenType.EMAIL_VERIFICATION, VERIFICATION_TTL);
        return new AuthResponse(userProfileService.toProfile(user), null, verification.getToken());
    }

    public AuthResponse login(LoginRequest request) {
        UserAccount user = userAccountRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides");
        }

        if (!user.isEmailVerified()) {
            UserToken verification = ensureVerificationToken(user);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Email non vérifié. Vérifiez votre boîte mail pour activer votre compte. Token: " + verification.getToken());
        }

        UserToken session = createToken(user, UserTokenType.SESSION, SESSION_TTL);
        UserProfileResponse profile = userProfileService.toProfile(user);
        return new AuthResponse(profile, session.getToken(), null);
    }

    public void logout(String token) {
        if (token == null || token.isBlank()) {
            return;
        }
        userTokenRepository.findByTokenAndType(token, UserTokenType.SESSION)
                .ifPresent(session -> {
                    session.setConsumedAt(Instant.now());
                    userTokenRepository.save(session);
                });
    }

    public UserProfileResponse verifyEmail(String token) {
        UserToken verification = requireActiveToken(token, UserTokenType.EMAIL_VERIFICATION);
        UserAccount user = verification.getUser();
        user.setEmailVerified(true);
        verification.setConsumedAt(Instant.now());
        userAccountRepository.save(user);
        userTokenRepository.save(verification);
        return userProfileService.toProfile(user);
    }

    public PasswordResetResponse requestPasswordReset(PasswordForgotRequest request) {
        Optional<UserAccount> user = userAccountRepository.findByEmailIgnoreCase(request.email());
        if (user.isEmpty()) {
            return new PasswordResetResponse("Si l'email existe, un lien de réinitialisation a été envoyé", null);
        }
        UserToken token = createToken(user.get(), UserTokenType.PASSWORD_RESET, RESET_TTL);
        return new PasswordResetResponse("Lien de réinitialisation généré", token.getToken());
    }

    public void resetPassword(PasswordResetRequest request) {
        UserToken resetToken = requireActiveToken(request.token(), UserTokenType.PASSWORD_RESET);
        UserAccount user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        resetToken.setConsumedAt(Instant.now());
        userAccountRepository.save(user);
        userTokenRepository.save(resetToken);
        revokeSessions(user.getId());
    }

    private void revokeSessions(UUID userId) {
        userTokenRepository.findByUserIdAndTypeAndConsumedAtIsNull(userId, UserTokenType.SESSION)
                .forEach(session -> {
                    session.setConsumedAt(Instant.now());
                    userTokenRepository.save(session);
                });
    }

    private UserToken createToken(UserAccount user, UserTokenType type, Duration ttl) {
        String value = UUID.randomUUID().toString();
        UserToken token = new UserToken(user, value, type, Instant.now().plus(ttl));
        return userTokenRepository.save(token);
    }

    private UserToken requireActiveToken(String token, UserTokenType type) {
        if (token == null || token.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token manquant");
        }
        return userTokenRepository.findByTokenAndType(token, type)
                .filter(found -> found.isActive(Instant.now()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token invalide ou expiré"));
    }

    private UserToken ensureVerificationToken(UserAccount user) {
        return userTokenRepository.findByUserIdAndTypeAndConsumedAtIsNull(user.getId(), UserTokenType.EMAIL_VERIFICATION)
                .stream()
                .filter(token -> token.isActive(Instant.now()))
                .findFirst()
                .orElseGet(() -> createToken(user, UserTokenType.EMAIL_VERIFICATION, VERIFICATION_TTL));
    }

    private Set<UserRole> resolveRoles(Set<UserRole> roles, String role) {
        if (roles != null && !roles.isEmpty()) {
            return Set.copyOf(roles);
        }
        if (role != null && !role.isBlank()) {
            try {
                return Set.of(UserRole.valueOf(role.trim().toUpperCase(Locale.ROOT)));
            } catch (IllegalArgumentException ex) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rôle invalide");
            }
        }
        return Set.of(UserRole.BUYER);
    }
}
