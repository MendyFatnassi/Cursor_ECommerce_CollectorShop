package com.collectorshop.listing;

import com.collectorshop.shared.model.Listing;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SellerListingControllerTest {

    @Mock
    private SellerListingService sellerListingService;

    @InjectMocks
    private SellerListingController sellerListingController;

    @Test
    void listingsDelegatesToService() {
        List<Listing> listings = List.of();
        when(sellerListingService.listSellerInventory()).thenReturn(listings);

        assertEquals(listings, sellerListingController.listings());
    }
}
