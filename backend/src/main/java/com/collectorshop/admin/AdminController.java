package com.collectorshop.admin;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/listings/pending")
    public List<PendingListingReview> pendingListings() {
        return adminService.pendingListings();
    }

    @PostMapping("/listings/{id}/approve")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void approve(@PathVariable UUID id) {
        adminService.approve(id);
    }

    @PostMapping("/listings/{id}/reject")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reject(@PathVariable UUID id) {
        adminService.reject(id);
    }

    @GetMapping("/fraud-alerts")
    public List<FraudAlert> fraudAlerts() {
        return adminService.fraudAlerts();
    }
}




