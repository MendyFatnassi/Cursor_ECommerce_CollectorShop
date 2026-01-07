package com.collectorshop.notification;

import com.collectorshop.shared.model.NotificationPreference;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationEvent> events() {
        return notificationService.recentEvents();
    }

    @GetMapping("/preferences")
    public List<NotificationPreference> preferences() {
        return notificationService.preferences();
    }

    @PatchMapping("/preferences/{id}")
    public NotificationPreference toggle(@PathVariable UUID id, @RequestBody Map<String, @NotNull Boolean> body) {
        return notificationService.togglePreference(id, Boolean.TRUE.equals(body.get("enabled")));
    }
}




