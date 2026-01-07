package com.collectorshop.shared.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record Listing(
        UUID id,
        UUID sellerId,
        String title,
        String description,
        BigDecimal price,
        String currency,
        List<String> mediaUrls,
        ListingStatus status,
        Instant lastReviewAt
) {
}




