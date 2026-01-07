package com.collectorshop.chat;

import com.collectorshop.shared.model.ChatThread;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ChatService {

    private final MessageSanitizer messageSanitizer;

    public ChatService(MessageSanitizer messageSanitizer) {
        this.messageSanitizer = messageSanitizer;
    }

    public List<ChatThread> threads(String context) {
        String preview = context.equals("buyer") ? "Le vendeur a envoyé les photos." : "L’acheteur demande un délai.";
        return List.of(
                new ChatThread(
                        UUID.randomUUID(),
                        UUID.fromString("11111111-1111-1111-1111-111111111111"),
                        UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                        UUID.fromString("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                        messageSanitizer.sanitizePreview(preview),
                        2,
                        Instant.now()
                )
        );
    }
}

