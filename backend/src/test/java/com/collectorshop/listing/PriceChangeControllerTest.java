package com.collectorshop.listing;

import com.collectorshop.shared.FraudWebhookGateway;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class PriceChangeControllerTest {

    @Mock
    private FraudWebhookGateway fraudWebhookGateway;

    @InjectMocks
    private PriceChangeController priceChangeController;

    @Test
    void recordChangeNotifiesGateway() {
        priceChangeController.recordChange("listing-1", Map.of("price", 120));

        verify(fraudWebhookGateway).notifyPriceChange("listing-1", "Nouveau prix 120");
    }
}
