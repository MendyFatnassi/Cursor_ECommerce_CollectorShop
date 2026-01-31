package com.collectorshop.listing;

import com.collectorshop.shared.model.Listing;
import com.collectorshop.shared.model.ListingStatus;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class SellerListingServiceTest {

    @Test
    void listSellerInventoryReturnsSeededListings() {
        SellerListingService service = new SellerListingService();

        List<Listing> listings = service.listSellerInventory();

        assertEquals(2, listings.size());
        assertEquals(ListingStatus.PUBLISHED, listings.get(0).status());
    }
}
