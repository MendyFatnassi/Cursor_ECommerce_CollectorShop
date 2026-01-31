package com.collectorshop.user;

import com.collectorshop.shared.model.UserRole;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public record UserProfileResponse(
        UUID id,
        String fullName,
        String email,
        boolean emailVerified,
        Set<UserRole> roles,
        List<String> preferredLocales,
        double reputation,
        Set<String> interestTags
) {
}
