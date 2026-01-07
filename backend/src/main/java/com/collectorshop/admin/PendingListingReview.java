package com.collectorshop.admin;

import java.time.Instant;
import java.util.UUID;

public record PendingListingReview(
        UUID id,
        String title,
        String sellerName,
        Instant submittedAt
) {
}




