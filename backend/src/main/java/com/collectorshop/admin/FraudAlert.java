package com.collectorshop.admin;

import java.time.Instant;
import java.util.UUID;

public record FraudAlert(
        UUID id,
        String severity,
        String message,
        Instant createdAt
) {
}




