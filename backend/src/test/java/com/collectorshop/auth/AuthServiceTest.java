package com.collectorshop.auth;

import com.collectorshop.shared.model.UserRole;
import com.collectorshop.user.UserAccount;
import com.collectorshop.user.UserAccountRepository;
import com.collectorshop.user.UserProfileResponse;
import com.collectorshop.user.UserProfileService;
import com.collectorshop.user.UserToken;
import com.collectorshop.user.UserTokenRepository;
import com.collectorshop.user.UserTokenType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Field;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserAccountRepository userAccountRepository;
    @Mock
    private UserTokenRepository userTokenRepository;
    @Mock
    private UserProfileService userProfileService;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerRejectsMissingTerms() {
        RegisterRequest request = new RegisterRequest(
                "Jean Dupont",
                "user@example.com",
                "Password1",
                Set.of(UserRole.BUYER),
                null,
                Boolean.FALSE
        );

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> authService.register(request));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }

    @Test
    void registerRejectsExistingEmail() {
        when(userAccountRepository.existsByEmailIgnoreCase("user@example.com")).thenReturn(true);
        RegisterRequest request = new RegisterRequest(
                "Jean Dupont",
                "user@example.com",
                "Password1",
                Set.of(UserRole.BUYER),
                null,
                Boolean.TRUE
        );

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> authService.register(request));
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    }

    @Test
    void registerMarksEmailVerified() {
        when(userAccountRepository.existsByEmailIgnoreCase(anyString())).thenReturn(false);
        when(passwordEncoder.encode("Password1")).thenReturn("hashed");
        when(userAccountRepository.save(any(UserAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userProfileService.toProfile(any(UserAccount.class))).thenReturn(sampleProfile());

        RegisterRequest request = new RegisterRequest(
                "Jean Dupont",
                "USER@EXAMPLE.COM",
                "Password1",
                Set.of(UserRole.BUYER),
                null,
                Boolean.TRUE
        );

        AuthResponse response = authService.register(request);

        assertNull(response.verificationToken());
        assertNull(response.token());
        ArgumentCaptor<UserAccount> userCaptor = ArgumentCaptor.forClass(UserAccount.class);
        verify(userAccountRepository).save(userCaptor.capture());
        assertEquals("user@example.com", userCaptor.getValue().getEmail());
        assertTrue(userCaptor.getValue().isEmailVerified());
    }

    @Test
    void loginAllowsUnverifiedEmail() {
        UserAccount user = sampleUser(false);
        when(userAccountRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Password1", "hash")).thenReturn(true);
        when(userTokenRepository.save(any(UserToken.class))).thenReturn(
                new UserToken(user, "session-token", UserTokenType.SESSION, Instant.now().plusSeconds(3600))
        );
        when(userProfileService.toProfile(user)).thenReturn(sampleProfile());

        LoginRequest request = new LoginRequest("user@example.com", "Password1");
        AuthResponse response = authService.login(request);

        assertEquals("session-token", response.token());
        assertNull(response.verificationToken());
        assertTrue(user.isEmailVerified());
        verify(userAccountRepository).save(user);
    }

    @Test
    void loginCreatesSessionTokenWhenVerified() {
        UserAccount user = sampleUser(true);
        when(userAccountRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Password1", "hash")).thenReturn(true);
        when(userTokenRepository.save(any(UserToken.class))).thenReturn(
                new UserToken(user, "session-token", UserTokenType.SESSION, Instant.now().plusSeconds(3600))
        );
        when(userProfileService.toProfile(user)).thenReturn(sampleProfile());

        LoginRequest request = new LoginRequest("user@example.com", "Password1");
        AuthResponse response = authService.login(request);

        assertEquals("session-token", response.token());
        assertNull(response.verificationToken());
    }

    @Test
    void logoutConsumesSessionToken() {
        UserAccount user = sampleUser(true);
        UserToken session = new UserToken(user, "session-token", UserTokenType.SESSION, Instant.now().plusSeconds(3600));
        when(userTokenRepository.findByTokenAndType("session-token", UserTokenType.SESSION)).thenReturn(Optional.of(session));
        when(userTokenRepository.save(any(UserToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        authService.logout("session-token");

        assertNotNull(session.getConsumedAt());
    }

    @Test
    void requestPasswordResetReturnsGenericMessageWhenMissingUser() {
        when(userAccountRepository.findByEmailIgnoreCase("missing@example.com")).thenReturn(Optional.empty());

        PasswordResetResponse response = authService.requestPasswordReset(new PasswordForgotRequest("missing@example.com"));

        assertEquals("Si l'email existe, un lien de réinitialisation a été envoyé", response.message());
        assertNull(response.resetToken());
    }

    @Test
    void resetPasswordUpdatesHashAndRevokesSessions() {
        UserAccount user = sampleUser(true);
        UserToken resetToken = new UserToken(user, "reset-token", UserTokenType.PASSWORD_RESET, Instant.now().plusSeconds(3600));
        UserToken sessionToken = new UserToken(user, "session-token", UserTokenType.SESSION, Instant.now().plusSeconds(3600));

        when(userTokenRepository.findByTokenAndType("reset-token", UserTokenType.PASSWORD_RESET))
                .thenReturn(Optional.of(resetToken));
        when(userTokenRepository.findByUserIdAndTypeAndConsumedAtIsNull(user.getId(), UserTokenType.SESSION))
                .thenReturn(List.of(sessionToken));
        when(passwordEncoder.encode("NewPassword1")).thenReturn("new-hash");
        when(userAccountRepository.save(any(UserAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userTokenRepository.save(any(UserToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        authService.resetPassword(new PasswordResetRequest("reset-token", "NewPassword1"));

        assertEquals("new-hash", user.getPasswordHash());
        assertNotNull(resetToken.getConsumedAt());
        assertNotNull(sessionToken.getConsumedAt());
    }

    private static UserProfileResponse sampleProfile() {
        return new UserProfileResponse(
                UUID.randomUUID(),
                "Jean Dupont",
                "user@example.com",
                true,
                Set.of(UserRole.BUYER),
                List.of("fr-FR"),
                0.0,
                Set.of()
        );
    }

    private static UserAccount sampleUser(boolean verified) {
        UserAccount user = new UserAccount("user@example.com", "hash", "Jean Dupont", Set.of(UserRole.BUYER));
        setId(user, UUID.randomUUID());
        user.setEmailVerified(verified);
        return user;
    }

    private static void setId(UserAccount user, UUID id) {
        try {
            Field field = UserAccount.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(user, id);
        } catch (ReflectiveOperationException ex) {
            throw new IllegalStateException("Impossible de définir l'identifiant pour le test", ex);
        }
    }
}
