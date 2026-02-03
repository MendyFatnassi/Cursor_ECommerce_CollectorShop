package com.collectorshop.notification;

import com.collectorshop.shared.model.NotificationChannel;
import com.collectorshop.shared.model.NotificationPreference;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class NotificationServiceTest {

    @Test
    void preferencesReturnsSeededValues() {
        NotificationService service = new NotificationService();

        assertEquals(2, service.preferences().size());
    }

    @Test
    void togglePreferenceUpdatesState() {
        NotificationService service = new NotificationService();
        NotificationPreference original = service.preferences().get(0);
        UUID id = original.id();

        NotificationPreference updated = service.togglePreference(id, false);

        assertEquals(id, updated.id());
        assertEquals(NotificationChannel.IN_APP, updated.channel());
        assertTrue(service.preferences().stream().anyMatch(pref -> pref.id().equals(id) && !pref.enabled()));
    }
}
