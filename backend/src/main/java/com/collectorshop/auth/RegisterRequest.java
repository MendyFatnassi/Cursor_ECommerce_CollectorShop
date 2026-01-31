package com.collectorshop.auth;

import com.collectorshop.shared.model.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record RegisterRequest(
        @NotBlank
        @Size(min = 2, max = 120)
        String fullName,
        @NotBlank
        @Email
        String email,
        @NotBlank
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).{8,}$")
        String password,
        Set<UserRole> roles,
        String role,
        @NotNull
        Boolean acceptedTerms
) {
}
