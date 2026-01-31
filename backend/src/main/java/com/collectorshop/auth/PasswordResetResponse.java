package com.collectorshop.auth;

public record PasswordResetResponse(
        String message,
        String resetToken
) {
}
