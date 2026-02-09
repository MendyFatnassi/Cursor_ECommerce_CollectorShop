package com.collectorshop.portal;

import com.collectorshop.shared.model.Listing;
import com.collectorshop.shared.model.UserRole;
import com.collectorshop.user.UserAccount;
import com.collectorshop.user.ProfileUpdateRequest;
import com.collectorshop.user.UserProfileResponse;
import com.collectorshop.user.UserProfileService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PortalControllerTest {

    @Mock
    private PortalService portalService;

    @Mock
    private UserProfileService userProfileService;

    @InjectMocks
    private PortalController portalController;

    @Test
    void profileDelegatesToService() {
        UUID userId = UUID.randomUUID();
        Jwt jwt = buildJwt();
        UserAccount account = new UserAccount("user@example.com", "hash", "Jean", Set.of(UserRole.BUYER));
        UserProfileResponse response = new UserProfileResponse(userId, "Jean", "user@example.com",
                true, Set.of(UserRole.BUYER), List.of("fr-FR"), 0.0, Set.of());
        when(userProfileService.ensureUser("user@example.com", "Jean", Set.of(UserRole.BUYER), true))
                .thenReturn(account);
        when(userProfileService.toProfile(account)).thenReturn(response);

        assertEquals(response, portalController.profile(jwt));
    }

    @Test
    void updateProfileDelegatesToService() {
        UUID userId = UUID.randomUUID();
        Jwt jwt = buildJwt();
        ProfileUpdateRequest request = new ProfileUpdateRequest("Jean", Set.of(UserRole.BUYER), Set.of("fr-FR"));
        UserProfileResponse response = new UserProfileResponse(userId, "Jean", "user@example.com",
                true, Set.of(UserRole.BUYER), List.of("fr-FR"), 0.0, Set.of());
        when(userProfileService.updateProfileByEmail("user@example.com", request)).thenReturn(response);

        assertEquals(response, portalController.updateProfile(jwt, request));
    }

    @Test
    void recommendationsDelegatesToService() {
        List<Listing> listings = List.of();
        when(portalService.getRecommendations()).thenReturn(listings);

        assertEquals(listings, portalController.recommendations());
    }

    @Test
    void addInterestDelegatesToService() {
        Jwt jwt = buildJwt();
        when(userProfileService.addInterestByEmail("user@example.com", "retro")).thenReturn(List.of("retro"));

        List<String> response = portalController.addInterest(jwt, Map.of("tag", "retro"));

        assertEquals(List.of("retro"), response);
        verify(userProfileService).addInterestByEmail("user@example.com", "retro");
    }

    @Test
    void adSlotsDelegatesToService() {
        List<AdSlot> slots = List.of(new AdSlot("Brand", "placement", "url", "interest:retro"));
        when(portalService.adSlots()).thenReturn(slots);

        assertEquals(slots, portalController.adSlots());
    }

    private static Jwt buildJwt() {
        return Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("email", "user@example.com")
                .claim("name", "Jean")
                .claim("email_verified", true)
                .claim("realm_access", Map.of("roles", List.of("BUYER")))
                .build();
    }
}
