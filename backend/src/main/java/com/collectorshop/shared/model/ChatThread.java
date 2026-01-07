package com.collectorshop.shared.model;

import java.time.Instant;
import java.util.UUID;

public record ChatThread(
        UUID id,
        UUID listingId,
        UUID buyerId,
        UUID sellerId,
        String lastMessagePreview,
        int unreadCount,
        Instant updatedAt
) {
}




