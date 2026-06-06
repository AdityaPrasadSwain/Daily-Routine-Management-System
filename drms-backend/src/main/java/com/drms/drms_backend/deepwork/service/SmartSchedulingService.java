package com.drms.drms_backend.deepwork.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;

@Service
public class SmartSchedulingService {

    private final ObjectProvider<ChatClient> chatClientProvider;

    public SmartSchedulingService(ObjectProvider<ChatClient> chatClientProvider) {
        this.chatClientProvider = chatClientProvider;
    }

    public String generateSchedule(String input) {
        ChatClient chatClient = chatClientProvider.getIfAvailable();

        if (chatClient == null) {
            // Fallback logic – AI optional
            return "{\"message\": \"AI is currently unavailable. Using default smart scheduling.\"}";
        }

        return chatClient.prompt()
                .user(input)
                .call()
                .content();
    }
}
