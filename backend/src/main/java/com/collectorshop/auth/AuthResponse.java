package com.collectorshop.auth;

import com.collectorshop.user.UserProfileResponse;

public record AuthResponse(
        UserProfileResponse profile,
        String token,
        String verificationToken
) {
}
