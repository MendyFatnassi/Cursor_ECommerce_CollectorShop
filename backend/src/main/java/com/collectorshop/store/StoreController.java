package com.collectorshop.store;

import com.collectorshop.auth.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    private final StoreService storeService;

    public StoreController(StoreService storeService) {
        this.storeService = storeService;
    }

    @GetMapping
    public List<StoreSummary> list(@AuthenticationPrincipal UserPrincipal principal) {
        return storeService.listStores(principal.id());
    }

    @PostMapping
    public StoreSummary create(@AuthenticationPrincipal UserPrincipal principal,
                               @Valid @RequestBody StoreCreateRequest request) {
        return storeService.createStore(principal.id(), request);
    }
}
