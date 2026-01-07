package com.collectorshop.listing;

import com.collectorshop.shared.model.Listing;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/seller")
public class SellerListingController {

    private final SellerListingService sellerListingService;

    public SellerListingController(SellerListingService sellerListingService) {
        this.sellerListingService = sellerListingService;
    }

    @GetMapping("/listings")
    public List<Listing> listings() {
        return sellerListingService.listSellerInventory();
    }
}




