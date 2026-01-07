package com.collectorshop.shared.model;

import java.util.UUID;

public record NotificationPreference(
        UUID id,
        UUID userId,
        NotificationTrigger trigger,
        NotificationChannel channel,
        boolean enabled
) {
}




