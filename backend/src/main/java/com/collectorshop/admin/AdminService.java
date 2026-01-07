package com.collectorshop.admin;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class AdminService {

    private final CopyOnWriteArrayList<PendingListingReview> pending = new CopyOnWriteArrayList<>(
            List.of(
                    new PendingListingReview(
                            UUID.fromString("99999999-9999-9999-9999-999999999999"),
                            "Statue résine rare",
                            "Boutique Nostalgia",
                            Instant.now()
                    )
            )
    );

    public List<PendingListingReview> pendingListings() {
        return pending;
    }

    public void approve(UUID id) {
        pending.removeIf(item -> item.id().equals(id));
    }

    public void reject(UUID id) {
        pending.removeIf(item -> item.id().equals(id));
    }

    public List<FraudAlert> fraudAlerts() {
        return List.of(
                new FraudAlert(UUID.randomUUID(), "HIGH", "Prix suspect sur l’annonce 11111111", Instant.now())
        );
    }
}




