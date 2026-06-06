package com.drms.drms_backend.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Base service for AI operations with error handling and fallback mechanisms
 */
@Service
public class BaseAiService {

    private static final Logger logger = LoggerFactory.getLogger(BaseAiService.class);

    @Autowired(required = false)
    protected ChatClient.Builder chatClientBuilder;

    @Autowired
    protected ObjectMapper objectMapper;

    /**
     * Call AI with error handling and timeout
     * 
     * @param promptText       The prompt to send to the AI
     * @param responseType     The expected response class type
     * @param fallbackResponse Response to return if AI call fails
     * @return Parsed AI response or fallback
     */
    protected <T> T callAi(String promptText, Class<T> responseType, T fallbackResponse) {
        try {
            if (chatClientBuilder == null) {
                logger.warn("ChatClient.Builder is not available (AI service disabled)");
                return fallbackResponse;
            }

            logger.info("Calling AI with prompt length: {} characters", promptText.length());

            ChatClient chatClient = chatClientBuilder.build();

            String response = chatClient.prompt()
                    .user(promptText)
                    .call()
                    .content();

            logger.info("AI response received: {} characters", response.length());

            // Extract JSON from potential Markdown text
            String jsonResponse = extractJson(response);

            // Parse JSON response
            T parsedResponse = objectMapper.readValue(jsonResponse, responseType);

            return parsedResponse;

        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            logger.error("Failed to parse AI response as JSON: {}", e.getMessage());
            return fallbackResponse;

        } catch (org.springframework.web.client.ResourceAccessException e) {
            logger.error("Ollama server not accessible: {}", e.getMessage());
            return fallbackResponse;

        } catch (Exception e) {
            logger.error("AI call failed: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            return fallbackResponse;
        }
    }

    /**
     * Check if Ollama is available
     * 
     * @return true if Ollama is running and accessible
     */
    protected boolean isOllamaAvailable() {
        if (chatClientBuilder == null) {
            return false;
        }
        try {
            ChatClient chatClient = chatClientBuilder.build();
            chatClient.prompt()
                    .user("test")
                    .call()
                    .content();
            return true;
        } catch (Exception e) {
            logger.warn("Ollama not available: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Extract JSON from AI response that might have extra text
     * Sometimes AI adds explanatory text before/after JSON
     */
    protected String extractJson(String response) {
        // Find first { and last }
        int start = response.indexOf('{');
        int end = response.lastIndexOf('}');

        if (start != -1 && end != -1 && end > start) {
            return response.substring(start, end + 1);
        }

        return response;
    }
}
