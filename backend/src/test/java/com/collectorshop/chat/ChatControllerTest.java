package com.collectorshop.chat;

import com.collectorshop.shared.model.ChatThread;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChatControllerTest {

    @Mock
    private ChatService chatService;

    @InjectMocks
    private ChatController chatController;

    @Test
    void threadsDelegatesToService() {
        List<ChatThread> threads = List.of();
        when(chatService.threads("seller")).thenReturn(threads);

        assertEquals(threads, chatController.threads("seller"));
    }
}
