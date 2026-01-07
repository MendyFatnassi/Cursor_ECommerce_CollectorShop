package com.collectorshop.notification;

import com.collectorshop.shared.model.NotificationChannel;
import com.collectorshop.shared.model.NotificationPreference;
import com.collectorshop.shared.model.NotificationTrigger;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class NotificationService {

    private final CopyOnWriteArrayList<NotificationPreference> preferences = new CopyOnWriteArrayList<>(
            List.of(
                    new NotificationPreference(
                            UUID.fromString("33333333-3333-3333-3333-333333333333"),
                            UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                            NotificationTrigger.NEW_LISTING,
                            NotificationChannel.IN_APP,
                            true
                    ),
                    new NotificationPreference(
                            UUID.fromString("44444444-4444-4444-4444-444444444444"),
                            UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                            NotificationTrigger.PRICE_CHANGE,
                            NotificationChannel.EMAIL,
                            true
                    )
            )
    );

    public List<NotificationEvent> recentEvents() {
        return List.of(
                new NotificationEvent(
                        UUID.randomUUID(),
                        "Nouvel article correspondant à vos intérêts : Carte rare",
                        Instant.now(),
                        NotificationChannel.IN_APP
                ),
                new NotificationEvent(
                        UUID.randomUUID(),
                        "Variation de prix : Figurine Dragon -5%",
                        Instant.now(),
                        NotificationChannel.EMAIL
                )
        );
    }

    public List<NotificationPreference> preferences() {
        return preferences;
    }

    public NotificationPreference togglePreference(UUID id, boolean enabled) {
        preferences.replaceAll(pref ->
                pref.id().equals(id)
                        ? new NotificationPreference(pref.id(), pref.userId(), pref.trigger(), pref.channel(), enabled)
                        : pref);
        return preferences.stream().filter(pref -> pref.id().equals(id)).findFirst().orElseThrow();
    }
}




