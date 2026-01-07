package com.collectorshop.chat;

import com.collectorshop.shared.model.ChatThread;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/threads")
    public List<ChatThread> threads(@RequestParam(defaultValue = "buyer") String context) {
        return chatService.threads(context);
    }
}




