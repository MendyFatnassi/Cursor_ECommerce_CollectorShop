package com.collectorshop.auth;

import com.collectorshop.shared.model.UserRole;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public final class KeycloakJwtHelper {

    private KeycloakJwtHelper() {
    }

    public static Set<String> extractRoleNames(Jwt jwt) {
        Set<String> roles = new HashSet<>();
        addRoles(roles, jwt.getClaim("realm_access"));
        addResourceRoles(roles, jwt.getClaim("resource_access"));
        return roles;
    }

    public static Set<UserRole> extractUserRoles(Jwt jwt) {
        Set<UserRole> mapped = new HashSet<>();
        for (String role : extractRoleNames(jwt)) {
            try {
                mapped.add(UserRole.valueOf(role.toUpperCase()));
            } catch (IllegalArgumentException ignored) {
                // Ignore unknown roles from Keycloak
            }
        }
        return mapped;
    }

    public static String extractEmail(Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        if (email != null && !email.isBlank()) {
            return email;
        }
        String username = jwt.getClaimAsString("preferred_username");
        if (username != null && !username.isBlank()) {
            return username;
        }
        return null;
    }

    public static String extractFullName(Jwt jwt) {
        String name = jwt.getClaimAsString("name");
        if (name != null && !name.isBlank()) {
            return name;
        }
        String username = jwt.getClaimAsString("preferred_username");
        if (username != null && !username.isBlank()) {
            return username;
        }
        return extractEmail(jwt);
    }

    public static boolean isEmailVerified(Jwt jwt) {
        Boolean verified = jwt.getClaim("email_verified");
        return Boolean.TRUE.equals(verified);
    }

    private static void addRoles(Set<String> roles, Object realmAccess) {
        if (!(realmAccess instanceof Map<?, ?> realmAccessMap)) {
            return;
        }
        Object roleList = realmAccessMap.get("roles");
        if (roleList instanceof Collection<?> values) {
            for (Object value : values) {
                if (value != null) {
                    roles.add(value.toString());
                }
            }
        }
    }

    private static void addResourceRoles(Set<String> roles, Object resourceAccess) {
        if (!(resourceAccess instanceof Map<?, ?> resourceMap)) {
            return;
        }
        for (Object clientAccess : resourceMap.values()) {
            addRoles(roles, clientAccess);
        }
    }
}
