package com.collectorshop.shared;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class FraudWebhookGatewayTest {

    @Test
    void notifyPriceChangeSwallowsFailures() {
        FraudWebhookGateway gateway = new FraudWebhookGateway("http://localhost:0");

        assertDoesNotThrow(() -> gateway.notifyPriceChange("listing-1", "Nouveau prix 120"));
    }
}
