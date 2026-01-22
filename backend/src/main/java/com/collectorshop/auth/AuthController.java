package com.collectorshop.auth;

import com.collectorshop.shared.model.UserProfile;
import com.collectorshop.shared.model.UserRole;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        // Simulation d'authentification (à remplacer par une vraie logique)
        if (email != null && password != null && password.length() >= 6) {
            UserProfile profile = createMockProfile(email, Set.of(UserRole.BUYER));
            
            Map<String, Object> response = new HashMap<>();
            response.put("profile", convertProfileToMap(profile));
            response.put("token", "mock-jwt-token-" + UUID.randomUUID());
            
            return ResponseEntity.ok(response);
        }

        Map<String, Object> error = new HashMap<>();
        error.put("message", "Email ou mot de passe incorrect");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> registration) {
        String fullName = registration.get("fullName");
        String email = registration.get("email");
        String password = registration.get("password");
        String roleStr = registration.getOrDefault("role", "BUYER");

        if (fullName == null || email == null || password == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Tous les champs sont requis");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        if (password.length() < 6) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Le mot de passe doit contenir au moins 6 caractères");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        try {
            UserRole role = UserRole.valueOf(roleStr);
            UserProfile profile = createMockProfile(fullName, email, Set.of(role));
            
            Map<String, Object> response = new HashMap<>();
            response.put("profile", convertProfileToMap(profile));
            response.put("token", "mock-jwt-token-" + UUID.randomUUID());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Rôle invalide");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    private Map<String, Object> convertProfileToMap(UserProfile profile) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", profile.id().toString());
        map.put("fullName", profile.fullName());
        map.put("roles", new ArrayList<>(profile.roles()));
        map.put("preferredLocales", new ArrayList<>(profile.locales()));
        map.put("reputation", profile.reputationScore());
        map.put("interestTags", new ArrayList<>(profile.interestTags()));
        return map;
    }

    private UserProfile createMockProfile(String email, Set<UserRole> roles) {
        return createMockProfile(email.split("@")[0], email, roles);
    }

    private UserProfile createMockProfile(String fullName, String email, Set<UserRole> roles) {
        return new UserProfile(
            UUID.randomUUID(),
            fullName,
            roles,
            new HashSet<>(),
            0.0,
            List.of("fr-FR")
        );
    }
}
