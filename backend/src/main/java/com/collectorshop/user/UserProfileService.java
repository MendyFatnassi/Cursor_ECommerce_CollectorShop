package com.collectorshop.user;

import com.collectorshop.shared.model.UserRole;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserProfileService {

    private final UserAccountRepository userAccountRepository;

    public UserProfileService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    public UserProfileResponse getProfile(UUID userId) {
        UserAccount user = requireUser(userId);
        return toProfile(user);
    }

    public UserProfileResponse updateProfile(UUID userId, ProfileUpdateRequest request) {
        UserAccount user = requireUser(userId);

        if (request.fullName() != null && !request.fullName().isBlank()) {
            user.setFullName(request.fullName().trim());
        }

        if (request.roles() != null && !request.roles().isEmpty()) {
            user.setRoles(request.roles());
        }

        if (request.preferredLocales() != null && !request.preferredLocales().isEmpty()) {
            Set<String> locales = request.preferredLocales().stream()
                    .filter(locale -> locale != null && !locale.isBlank())
                    .map(String::trim)
                    .collect(Collectors.toSet());
            if (!locales.isEmpty()) {
                user.setLocales(locales);
            }
        }

        userAccountRepository.save(user);
        return toProfile(user);
    }

    public List<String> addInterest(UUID userId, String tag) {
        UserAccount user = requireUser(userId);
        String sanitized = tag == null ? "" : tag.trim();
        if (!sanitized.isEmpty()) {
            user.getInterestTags().add(sanitized);
            userAccountRepository.save(user);
        }
        return List.copyOf(user.getInterestTags());
    }

    public UserAccount requireUser(UUID userId) {
        return userAccountRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
    }

    public UserProfileResponse toProfile(UserAccount user) {
        Set<UserRole> roles = user.getRoles() == null ? Set.of() : Set.copyOf(user.getRoles());
        List<String> locales = user.getLocales() == null ? List.of() : List.copyOf(user.getLocales());
        Set<String> interests = user.getInterestTags() == null ? Set.of() : Set.copyOf(user.getInterestTags());
        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.isEmailVerified(),
                roles,
                locales,
                user.getReputationScore(),
                interests
        );
    }
}
