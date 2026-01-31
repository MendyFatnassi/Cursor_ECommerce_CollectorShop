package com.collectorshop.portal;

import com.collectorshop.auth.UserPrincipal;
import com.collectorshop.shared.model.Listing;
import com.collectorshop.user.ProfileUpdateRequest;
import com.collectorshop.user.UserProfileResponse;
import com.collectorshop.user.UserProfileService;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PortalController {

    private final PortalService portalService;
    private final UserProfileService userProfileService;

    public PortalController(PortalService portalService, UserProfileService userProfileService) {
        this.portalService = portalService;
        this.userProfileService = userProfileService;
    }

    @GetMapping("/profiles/me")
    public UserProfileResponse profile(@AuthenticationPrincipal UserPrincipal principal) {
        return userProfileService.getProfile(principal.id());
    }

    @PatchMapping("/profiles/me")
    public UserProfileResponse updateProfile(@AuthenticationPrincipal UserPrincipal principal,
                                             @Valid @RequestBody ProfileUpdateRequest request) {
        return userProfileService.updateProfile(principal.id(), request);
    }

    @GetMapping("/recommendations")
    public List<Listing> recommendations() {
        return portalService.getRecommendations();
    }

    @PostMapping("/profiles/interests")
    @ResponseStatus(HttpStatus.CREATED)
    public List<String> addInterest(@AuthenticationPrincipal UserPrincipal principal, @RequestBody Map<String, String> body) {
        return userProfileService.addInterest(principal.id(), body.getOrDefault("tag", ""));
    }

    @GetMapping("/ads/slots")
    public List<AdSlot> adSlots() {
        return portalService.adSlots();
    }
}

