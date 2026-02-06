package com.collectorshop.portal;

import com.collectorshop.shared.model.Listing;
import com.collectorshop.shared.model.ListingStatus;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PortalServiceTest {

    @Test
    void getRecommendationsReturnsPublishedListings() {
        PortalService service = new PortalService();

        List<Listing> listings = service.getRecommendations();

        assertEquals(2, listings.size());
        assertEquals(ListingStatus.PUBLISHED, listings.get(0).status());
    }

    @Test
    void adSlotsReturnsConfiguredSlots() {
        PortalService service = new PortalService();

        assertEquals(2, service.adSlots().size());
    }
}
