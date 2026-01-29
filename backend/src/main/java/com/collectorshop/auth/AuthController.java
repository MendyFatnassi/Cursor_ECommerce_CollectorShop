package com.collectorshop.auth;

import com.collectorshop.shared.model.UserProfile;
import com.collectorshop.shared.model.UserRole;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Email et mot de passe requis");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Email ou mot de passe incorrect");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        User user = userOpt.get();
        
        // Vérifier le mot de passe (hashé avec BCrypt)
        if (!passwordEncoder.matches(password, user.getPassword())) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Email ou mot de passe incorrect");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        UserProfile profile = convertUserToProfile(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("profile", convertProfileToMap(profile));
        response.put("token", "mock-jwt-token-" + UUID.randomUUID());
        
        return ResponseEntity.ok(response);
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

        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(email)) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Cet email est déjà utilisé");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }

        try {
            UserRole role = UserRole.valueOf(roleStr);
            
            // Créer et sauvegarder l'utilisateur
            User user = new User();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password)); // Hasher le mot de passe
            user.setFullName(fullName);
            user.setRoles(Set.of(role));
            user.setLocales(Set.of("fr-FR"));
            user.setReputationScore(0.0);
            user.setInterestTags(new HashSet<>());
            
            user = userRepository.save(user);
            
            UserProfile profile = convertUserToProfile(user);
            
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

    private UserProfile convertUserToProfile(User user) {
        return new UserProfile(
            user.getId(),
            user.getFullName(),
            user.getRoles(),
            user.getInterestTags(),
            user.getReputationScore() != null ? user.getReputationScore() : 0.0,
            new ArrayList<>(user.getLocales())
        );
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
}
