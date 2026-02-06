package com.collectorshop.auth;

import com.collectorshop.shared.model.UserRole;
import com.collectorshop.user.UserProfileResponse;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

class AuthModelsTest {

    @Test
    void recordsExposeValues() {
        RegisterRequest registerRequest = new RegisterRequest(
                "Jean",
                "user@example.com",
                "Password1",
                Set.of(UserRole.BUYER),
                null,
                Boolean.TRUE
        );
        LoginRequest loginRequest = new LoginRequest("user@example.com", "Password1");
        PasswordForgotRequest forgotRequest = new PasswordForgotRequest("user@example.com");
        PasswordResetRequest resetRequest = new PasswordResetRequest("token", "Password1");
        PasswordResetResponse resetResponse = new PasswordResetResponse("ok", "token");
        UserProfileResponse profile = new UserProfileResponse(
                UUID.randomUUID(),
                "Jean",
                "user@example.com",
                true,
                Set.of(UserRole.BUYER),
                List.of("fr-FR"),
                0.0,
                Set.of()
        );
        AuthResponse authResponse = new AuthResponse(profile, "session", null);

        assertEquals("Jean", registerRequest.fullName());
        assertEquals("user@example.com", loginRequest.email());
        assertEquals("ok", resetResponse.message());
        assertEquals("session", authResponse.token());
        assertEquals("token", resetRequest.token());
        assertEquals("user@example.com", forgotRequest.email());
    }

    @Test
    void userPrincipalBuildsAuthorities() {
        UserPrincipal principal = new UserPrincipal(UUID.randomUUID(), "user@example.com", Set.of(UserRole.ADMIN));

        assertEquals(1, principal.authorities().size());
        assertFalse(principal.authorities().isEmpty());
    }
}
