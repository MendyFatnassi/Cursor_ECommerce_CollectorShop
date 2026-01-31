package com.collectorshop.user;

import com.collectorshop.shared.model.UserRole;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record ProfileUpdateRequest(
        @Size(min = 2, max = 120)
        String fullName,
        Set<UserRole> roles,
        Set<String> preferredLocales
) {
}
