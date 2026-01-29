package com.collectorshop.auth;

import com.collectorshop.shared.model.UserRole;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record UserPrincipal(UUID id, String email, Set<UserRole> roles) {

    public Collection<? extends GrantedAuthority> authorities() {
        if (roles == null) {
            return Set.of();
        }
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .collect(Collectors.toSet());
    }
}
