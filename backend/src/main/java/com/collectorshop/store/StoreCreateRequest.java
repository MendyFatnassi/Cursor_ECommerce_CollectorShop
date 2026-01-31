package com.collectorshop.store;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StoreCreateRequest(
        @NotBlank
        @Size(min = 2, max = 80)
        String name
) {
}
