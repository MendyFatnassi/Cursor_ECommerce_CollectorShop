package com.collectorshop.portal;

import com.collectorshop.shared.model.Listing;
import com.collectorshop.shared.model.ListingStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class PortalService {

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

    public List<AdSlot> adSlots() {
        return List.of(
                new AdSlot("RetroWorld", "dashboard-right", "https://ads.retro/creative1", "interest:retro"),
                new AdSlot("FigurineClub", "dashboard-bottom", "https://ads.figclub/banner.png", "interest:figurines")
        );
    }
}

