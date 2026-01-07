package com.collectorshop.shared;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
public class FraudWebhookGateway {

    private static final Logger log = LoggerFactory.getLogger(FraudWebhookGateway.class);
    private final RestClient restClient;
    private final String outboundUrl;

    public FraudWebhookGateway(@Value("${collector.fraud.outbound-url}") String outboundUrl) {
        this.outboundUrl = outboundUrl;
        this.restClient = RestClient.builder().build();
    }

    public void notifyPriceChange(String listingId, String message) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> payload = new HttpEntity<>(Map.of(
                    "listingId", listingId,
                    "message", message
            ), headers);
            restClient.post().uri(outboundUrl).body(payload).retrieve();
        } catch (Exception ex) {
            log.warn("Fraud webhook unreachable: {}", ex.getMessage());
        }
    }
}




