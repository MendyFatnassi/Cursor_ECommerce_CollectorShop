package com.collectorshop.portal;

import com.collectorshop.auth.UserPrincipal;
import com.collectorshop.shared.model.Listing;
import com.collectorshop.shared.model.UserRole;
import com.collectorshop.user.ProfileUpdateRequest;
import com.collectorshop.user.UserProfileResponse;
import com.collectorshop.user.UserProfileService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
        UserPrincipal principal = new UserPrincipal(userId, "user@example.com", Set.of(UserRole.BUYER));
        UserProfileResponse response = new UserProfileResponse(userId, "Jean", "user@example.com",
                true, Set.of(UserRole.BUYER), List.of("fr-FR"), 0.0, Set.of());
        when(userProfileService.getProfile(userId)).thenReturn(response);

        assertEquals(response, portalController.profile(principal));
    }

    @Test
    void updateProfileDelegatesToService() {
        UUID userId = UUID.randomUUID();
        UserPrincipal principal = new UserPrincipal(userId, "user@example.com", Set.of(UserRole.BUYER));
        ProfileUpdateRequest request = new ProfileUpdateRequest("Jean", Set.of(UserRole.BUYER), Set.of("fr-FR"));
        UserProfileResponse response = new UserProfileResponse(userId, "Jean", "user@example.com",
                true, Set.of(UserRole.BUYER), List.of("fr-FR"), 0.0, Set.of());
        when(userProfileService.updateProfile(userId, request)).thenReturn(response);

        assertEquals(response, portalController.updateProfile(principal, request));
    }

    @Test
    void recommendationsDelegatesToService() {
        List<Listing> listings = List.of();
        when(portalService.getRecommendations()).thenReturn(listings);

        assertEquals(listings, portalController.recommendations());
    }

    @Test
    void addInterestDelegatesToService() {
        UUID userId = UUID.randomUUID();
        UserPrincipal principal = new UserPrincipal(userId, "user@example.com", Set.of(UserRole.BUYER));
        when(userProfileService.addInterest(userId, "retro")).thenReturn(List.of("retro"));

        List<String> response = portalController.addInterest(principal, Map.of("tag", "retro"));

        assertEquals(List.of("retro"), response);
        verify(userProfileService).addInterest(userId, "retro");
    }

    @Test
    void adSlotsDelegatesToService() {
        List<AdSlot> slots = List.of(new AdSlot("Brand", "placement", "url", "interest:retro"));
        when(portalService.adSlots()).thenReturn(slots);

        assertEquals(slots, portalController.adSlots());
    }
}
