package com.collectorshop.store;

import java.time.Instant;
import java.util.UUID;

public record StoreSummary(
        UUID id,
        String name,
        String slug,
        Instant createdAt
) {
}
