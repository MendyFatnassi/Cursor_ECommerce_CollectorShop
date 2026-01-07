package com.collectorshop.listing;

import com.collectorshop.shared.model.Listing;
import com.collectorshop.shared.model.ListingStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class SellerListingService {

    public List<Listing> listSellerInventory() {
        return List.of(
                new Listing(
                        UUID.fromString("11111111-1111-1111-1111-111111111111"),
                        UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                        "Album vinyle 1975",
                        "Pressage original contrôlé",
                        new BigDecimal("95.00"),
                        "EUR",
                        List.of("https://cdn.collector.shop/vinyl.png"),
                        ListingStatus.PUBLISHED,
                        Instant.now()
                ),
                new Listing(
                        UUID.fromString("22222222-2222-2222-2222-222222222222"),
                        UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                        "Console rétro",
                        "Console testée, garantie Collector.shop",
                        new BigDecimal("260.00"),
                        "EUR",
                        List.of("https://cdn.collector.shop/console.png"),
                        ListingStatus.PENDING_REVIEW,
                        Instant.now()
                )
        );
    }
}




