package com.collectorshop.auth;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @Test
    void registerReturnsCreatedStatus() {
        AuthResponse response = new AuthResponse(null, null, "verification");
        RegisterRequest request = new RegisterRequest("Jean", "user@example.com", "Password1", null, "BUYER", true);
        when(authService.register(request)).thenReturn(response);

        ResponseEntity<AuthResponse> entity = authController.register(request);

        assertEquals(HttpStatus.CREATED, entity.getStatusCode());
        assertEquals(response, entity.getBody());
    }

    @Test
    void loginReturnsOk() {
        LoginRequest request = new LoginRequest("user@example.com", "Password1");
        AuthResponse response = new AuthResponse(null, "token", null);
        when(authService.login(request)).thenReturn(response);

        ResponseEntity<AuthResponse> entity = authController.login(request);

        assertEquals(HttpStatus.OK, entity.getStatusCode());
        assertEquals(response, entity.getBody());
    }

    @Test
    void logoutExtractsBearerToken() {
        ResponseEntity<Void> entity = authController.logout("Bearer abc123");

        assertEquals(HttpStatus.NO_CONTENT, entity.getStatusCode());
        verify(authService).logout("abc123");
    }

    @Test
    void logoutHandlesRawToken() {
        authController.logout("raw-token");

        verify(authService).logout("raw-token");
    }
}
