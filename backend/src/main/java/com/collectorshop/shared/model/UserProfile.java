package com.collectorshop.shared.model;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public record UserProfile(
        UUID id,
        String fullName,
        Set<UserRole> roles,
        Set<String> interestTags,
        double reputationScore,
        List<String> locales
) {
    public boolean hasRole(UserRole role) {
        return roles != null && roles.contains(role);
    }
}




