package com.collectorshop.notification;

import com.collectorshop.shared.model.NotificationChannel;

import java.time.Instant;
import java.util.UUID;

public record NotificationEvent(
        UUID id,
        String message,
        Instant createdAt,
        NotificationChannel channel
) {
}




