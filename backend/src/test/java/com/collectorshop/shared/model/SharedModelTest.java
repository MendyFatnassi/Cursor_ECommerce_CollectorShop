package com.collectorshop.shared.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SharedModelTest {

    @Test
    void userProfileHasRoleChecksMembership() {
        UserProfile profile = new UserProfile(
                UUID.randomUUID(),
                "Jean",
                Set.of(UserRole.ADMIN),
                Set.of("retro"),
                4.2,
                List.of("fr-FR")
        );

        assertTrue(profile.hasRole(UserRole.ADMIN));
        assertFalse(profile.hasRole(UserRole.BUYER));
    }

    @Test
    void listingStoresFields() {
        Listing listing = new Listing(
                UUID.randomUUID(),
                UUID.randomUUID(),
                "Objet",
                "Description",
                new BigDecimal("10.00"),
                "EUR",
                List.of("https://example.com/img.png"),
                ListingStatus.PUBLISHED,
                Instant.now()
        );

        assertEquals("Objet", listing.title());
        assertEquals(ListingStatus.PUBLISHED, listing.status());
    }

    @Test
    void notificationPreferenceStoresFields() {
        UUID id = UUID.randomUUID();
        NotificationPreference preference = new NotificationPreference(
                id,
                UUID.randomUUID(),
                NotificationTrigger.PRICE_CHANGE,
                NotificationChannel.EMAIL,
                true
        );

        assertEquals(id, preference.id());
        assertTrue(preference.enabled());
    }

    @Test
    void chatThreadStoresFields() {
        UUID id = UUID.randomUUID();
        ChatThread thread = new ChatThread(
                id,
                UUID.randomUUID(),
                UUID.randomUUID(),
                UUID.randomUUID(),
                "Aperçu",
                1,
                Instant.now()
        );

        assertEquals(id, thread.id());
        assertEquals(1, thread.unreadCount());
    }
}
