package com.collectorshop.store;

import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

class StoreModelsTest {

    @Test
    void storeRecordsExposeValues() {
        StoreCreateRequest createRequest = new StoreCreateRequest("Boutique Retro");
        StoreSummary summary = new StoreSummary(UUID.randomUUID(), "Boutique Retro", "boutique-retro", Instant.now());

        assertEquals("Boutique Retro", createRequest.name());
        assertEquals("boutique-retro", summary.slug());
    }
}
