package com.collectorshop.admin;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    @Test
    void pendingListingsDelegatesToService() {
        List<PendingListingReview> expected = List.of(
                new PendingListingReview(UUID.randomUUID(), "Titre", "Boutique", java.time.Instant.now())
        );
        when(adminService.pendingListings()).thenReturn(expected);

        assertEquals(expected, adminController.pendingListings());
    }

    @Test
    void approveDelegatesToService() {
        UUID id = UUID.randomUUID();

        adminController.approve(id);

        verify(adminService).approve(id);
    }

    @Test
    void rejectDelegatesToService() {
        UUID id = UUID.randomUUID();

        adminController.reject(id);

        verify(adminService).reject(id);
    }

    @Test
    void fraudAlertsDelegatesToService() {
        List<FraudAlert> alerts = List.of(new FraudAlert(UUID.randomUUID(), "HIGH", "Message", java.time.Instant.now()));
        when(adminService.fraudAlerts()).thenReturn(alerts);

        assertEquals(alerts, adminController.fraudAlerts());
    }
}
