package com.collectorshop.portal;

import com.collectorshop.shared.model.Listing;
import com.collectorshop.shared.model.UserProfile;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
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

    public PortalController(PortalService portalService) {
        this.portalService = portalService;
    }

    @GetMapping("/profiles/me")
    public UserProfile profile() {
        return portalService.getDefaultProfile();
    }

    @GetMapping("/recommendations")
    public List<Listing> recommendations() {
        return portalService.getRecommendations();
    }

    @PostMapping("/profiles/interests")
    @ResponseStatus(HttpStatus.CREATED)
    public List<String> addInterest(@RequestBody Map<String, String> body) {
        return portalService.updateInterestTags(body.getOrDefault("tag", ""));
    }

    @GetMapping("/ads/slots")
    public List<AdSlot> adSlots() {
        return portalService.adSlots();
    }
}

