package com.collectorshop.portal;

import com.collectorshop.shared.model.Listing;
import com.collectorshop.shared.model.ListingStatus;
import com.collectorshop.shared.model.UserProfile;
import com.collectorshop.shared.model.UserRole;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class PortalService {

    private final CopyOnWriteArrayList<String> interestTags = new CopyOnWriteArrayList<>(List.of("figurines", "retro"));

    public UserProfile getDefaultProfile() {
        return new UserProfile(
                UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                "Alicia Dupont",
                Set.of(UserRole.BUYER, UserRole.SELLER),
                Set.copyOf(interestTags),
                4.7,
                List.of("fr-FR", "en-GB")
        );
    }

    public List<Listing> getRecommendations() {
        return List.of(
                new Listing(
                        UUID.fromString("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                        UUID.fromString("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                        "Figurine édition limitée",
                        "Collector 1990 contrôlé par Collector.shop",
                        new BigDecimal("320.00"),
                        "EUR",
                        List.of("https://cdn.collector.shop/limited.png"),
                        ListingStatus.PUBLISHED,
                        Instant.now()
                ),
                new Listing(
                        UUID.fromString("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                        UUID.fromString("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                        "Affiche rétro originale",
                        "Poster cinéma restauré",
                        new BigDecimal("180.00"),
                        "EUR",
                        List.of("https://cdn.collector.shop/poster.png"),
                        ListingStatus.PUBLISHED,
                        Instant.now()
                )
        );
    }

    public List<String> updateInterestTags(String newTag) {
        interestTags.addIfAbsent(newTag);
        return new ArrayList<>(interestTags);
    }

    public List<AdSlot> adSlots() {
        return List.of(
                new AdSlot("RetroWorld", "dashboard-right", "https://ads.retro/creative1", "interest:retro"),
                new AdSlot("FigurineClub", "dashboard-bottom", "https://ads.figclub/banner.png", "interest:figurines")
        );
    }
}

