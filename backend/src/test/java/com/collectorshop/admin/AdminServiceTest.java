package com.collectorshop.admin;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

class AdminServiceTest {

    @Test
    void approveRemovesPendingListing() {
        AdminService service = new AdminService();
        List<PendingListingReview> pending = service.pendingListings();
        UUID id = pending.get(0).id();

        service.approve(id);

        assertFalse(service.pendingListings().stream().anyMatch(item -> item.id().equals(id)));
    }

    @Test
    void fraudAlertsReturnsItems() {
        AdminService service = new AdminService();

        assertEquals(1, service.fraudAlerts().size());
    }
}
