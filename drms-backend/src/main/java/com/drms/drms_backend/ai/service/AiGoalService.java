package com.drms.drms_backend.ai.service;

import com.drms.drms_backend.ai.dto.request.GoalSuggestionRequest;
import com.drms.drms_backend.ai.dto.response.GoalSuggestionResponse;
import com.drms.drms_backend.ai.prompt.PromptTemplates;
import com.drms.drms_backend.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Arrays;

/**
 * Service for AI-powered goal suggestions
 */
@Service
public class AiGoalService extends BaseAiService {

        private static final Logger logger = LoggerFactory.getLogger(AiGoalService.class);

        /**
         * Generate AI-powered goal suggestions
         * 
         * @param request Goal suggestion request with title and description
         * @param user    Authenticated user (for logging/future personalization)
         * @return AI-generated goal suggestions or fallback
         */
        public GoalSuggestionResponse suggestGoal(GoalSuggestionRequest request, User user) {
                logger.info("Generating goal suggestions for user: {} - Goal: {}",
                                user.getEmail(), request.getTitle());

                // Check if Ollama is available
                if (!isOllamaAvailable()) {
                        logger.warn("Ollama not available, returning fallback response");
                        return createFallbackResponse(request);
                }

                // Build prompt from template
                String prompt = PromptTemplates.fillTemplate(
                                PromptTemplates.GOAL_SUGGESTION_PROMPT,
                                "title", request.getTitle(),
                                "description", request.getDescription() != null ? request.getDescription()
                                                : "No description provided");

                // Call AI with fallback
                GoalSuggestionResponse fallback = createFallbackResponse(request);
                GoalSuggestionResponse response = callAi(prompt, GoalSuggestionResponse.class, fallback);

                logger.info("Goal suggestion generated successfully");
                return response;
        }

        /**
         * Create fallback response when AI is unavailable
         */
        private GoalSuggestionResponse createFallbackResponse(GoalSuggestionRequest request) {
                return new GoalSuggestionResponse(
                                "Improved Goal: " + request.getTitle(),
                                "AI service is currently unavailable. Here's a basic suggestion: " +
                                                request.getTitle() + " - " +
                                                (request.getDescription() != null ? request.getDescription()
                                                                : "Focus on breaking this goal into smaller, actionable steps."),
                                Arrays.asList(
                                                "Define specific milestones for this goal",
                                                "Set a realistic timeline",
                                                "Identify resources needed",
                                                "Create an action plan"),
                                "WEEKLY",
                                "Weekly goals provide a good balance between short-term focus and long-term progress.");
        }
}
