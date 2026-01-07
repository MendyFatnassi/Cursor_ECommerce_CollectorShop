package com.collectorshop.listing;

import com.collectorshop.shared.FraudWebhookGateway;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/listings")
public class PriceChangeController {

    private final FraudWebhookGateway fraudWebhookGateway;

    public PriceChangeController(FraudWebhookGateway fraudWebhookGateway) {
        this.fraudWebhookGateway = fraudWebhookGateway;
    }

    @PostMapping("/{id}/price-change")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void recordChange(@PathVariable String id, @RequestBody Map<String, Object> payload) {
        String message = "Nouveau prix " + payload.getOrDefault("price", "N/A");
        fraudWebhookGateway.notifyPriceChange(id, message);
    }
}




