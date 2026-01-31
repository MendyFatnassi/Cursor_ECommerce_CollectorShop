package com.collectorshop.chat;

import com.collectorshop.shared.model.ChatThread;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ChatServiceTest {

    @Test
    void threadsUsesSanitizer() {
        MessageSanitizer sanitizer = mock(MessageSanitizer.class);
        when(sanitizer.sanitizePreview("Le vendeur a envoyé les photos.")).thenReturn("preview-ok");

        ChatService service = new ChatService(sanitizer);
        List<ChatThread> threads = service.threads("buyer");

        assertEquals("preview-ok", threads.get(0).lastMessagePreview());
        verify(sanitizer).sanitizePreview("Le vendeur a envoyé les photos.");
    }
}
