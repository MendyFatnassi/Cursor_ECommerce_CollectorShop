package com.collectorshop.user;

import com.collectorshop.shared.model.UserRole;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class UserProfileService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileService(UserAccountRepository userAccountRepository, PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserProfileResponse getProfile(@NonNull UUID userId) {
        UserAccount user = requireUser(userId);
        return toProfile(user);
    }

    public UserProfileResponse getProfileByEmail(@NonNull String email) {
        UserAccount user = requireUserByEmail(email);
        return toProfile(user);
    }

    public UserProfileResponse updateProfile(@NonNull UUID userId, ProfileUpdateRequest request) {
        UserAccount user = requireUser(userId);

        if (request.fullName() != null && !request.fullName().isBlank()) {
            user.setFullName(request.fullName().trim());
        }

        if (request.roles() != null && !request.roles().isEmpty()) {
            Set<UserRole> nextRoles = request.roles().stream()
                    .filter(role -> role == UserRole.BUYER || role == UserRole.SELLER)
                    .collect(Collectors.toSet());
            if (user.getRoles() != null && user.getRoles().contains(UserRole.ADMIN)) {
                nextRoles.add(UserRole.ADMIN);
            }
            if (nextRoles.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Au moins un rôle est requis");
            }
            user.setRoles(nextRoles);
        }

        if (request.preferredLocales() != null && !request.preferredLocales().isEmpty()) {
            Set<String> locales = request.preferredLocales().stream()
                    .filter(locale -> locale != null && !locale.isBlank())
                    .map(String::trim)
                    .collect(Collectors.toSet());
            if (!locales.isEmpty()) {
                user.setLocales(locales);
            }
        }

        userAccountRepository.save(Objects.requireNonNull(user));
        return toProfile(user);
    }

    public UserProfileResponse updateProfileByEmail(@NonNull String email, ProfileUpdateRequest request) {
        UserAccount user = requireUserByEmail(email);
        return updateProfile(Objects.requireNonNull(user.getId()), request);
    }

    public List<String> addInterest(@NonNull UUID userId, String tag) {
        UserAccount user = requireUser(userId);
        String sanitized = tag == null ? "" : tag.trim();
        if (!sanitized.isEmpty()) {
            user.getInterestTags().add(sanitized);
            userAccountRepository.save(user);
        }
        return List.copyOf(user.getInterestTags());
    }

    public List<String> addInterestByEmail(@NonNull String email, String tag) {
        UserAccount user = requireUserByEmail(email);
        return addInterest(Objects.requireNonNull(user.getId()), tag);
    }

    public UserAccount requireUser(@NonNull UUID userId) {
        return userAccountRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
    }

    public UserAccount requireUserByEmail(@NonNull String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email manquant");
        }
        return userAccountRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
    }

    public UserAccount ensureUser(@NonNull String email, String fullName, Set<UserRole> roles, boolean emailVerified) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email manquant");
        }
        return userAccountRepository.findByEmailIgnoreCase(email)
                .orElseGet(() -> {
                    Set<UserRole> nextRoles = roles == null || roles.isEmpty()
                            ? Set.of(UserRole.BUYER)
                            : roles;
                    String safeName = fullName == null || fullName.isBlank() ? email : fullName;
                    String randomSecret = "keycloak:" + ThreadLocalRandom.current().nextLong();
                    UserAccount user = new UserAccount(
                            email,
                            passwordEncoder.encode(randomSecret),
                            safeName,
                            nextRoles
                    );
                    user.setEmailVerified(emailVerified);
                    return userAccountRepository.save(user);
                });
    }

    public UserProfileResponse toProfile(UserAccount user) {
        Set<UserRole> roles = user.getRoles() == null ? Set.of() : Set.copyOf(user.getRoles());
        List<String> locales = user.getLocales() == null ? List.of() : List.copyOf(user.getLocales());
        Set<String> interests = user.getInterestTags() == null ? Set.of() : Set.copyOf(user.getInterestTags());
        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.isEmailVerified(),
                roles,
                locales,
                user.getReputationScore(),
                interests
        );
    }
}
