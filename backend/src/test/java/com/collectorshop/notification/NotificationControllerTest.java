package com.collectorshop.notification;

import com.collectorshop.shared.model.NotificationChannel;
import com.collectorshop.shared.model.NotificationPreference;
import com.collectorshop.shared.model.NotificationTrigger;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationControllerTest {

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private NotificationController notificationController;

    @Test
    void eventsDelegatesToService() {
        List<NotificationEvent> events = List.of(
                new NotificationEvent(UUID.randomUUID(), "Message", java.time.Instant.now(), NotificationChannel.IN_APP)
        );
        when(notificationService.recentEvents()).thenReturn(events);

        assertEquals(events, notificationController.events());
    }

    @Test
    void preferencesDelegatesToService() {
        List<NotificationPreference> prefs = List.of(
                new NotificationPreference(UUID.randomUUID(), UUID.randomUUID(), NotificationTrigger.NEW_LISTING,
                        NotificationChannel.IN_APP, true)
        );
        when(notificationService.preferences()).thenReturn(prefs);

        assertEquals(prefs, notificationController.preferences());
    }

    @Test
    void toggleDelegatesToService() {
        UUID id = UUID.randomUUID();
        NotificationPreference pref = new NotificationPreference(id, UUID.randomUUID(), NotificationTrigger.PRICE_CHANGE,
                NotificationChannel.EMAIL, false);
        when(notificationService.togglePreference(id, true)).thenReturn(pref);

        NotificationPreference response = notificationController.toggle(id, Map.of("enabled", true));

        assertEquals(pref, response);
        verify(notificationService).togglePreference(id, true);
    }
}
