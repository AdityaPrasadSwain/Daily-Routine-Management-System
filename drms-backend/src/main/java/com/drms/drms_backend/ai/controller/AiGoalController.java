package com.drms.drms_backend.ai.controller;

import com.drms.drms_backend.ai.dto.request.GoalSuggestionRequest;
import com.drms.drms_backend.ai.dto.response.GoalSuggestionResponse;
import com.drms.drms_backend.ai.service.AiGoalService;
import com.drms.drms_backend.entity.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for AI Goal Assistant features
 */
@RestController
@RequestMapping("/api/ai/goals")
@lombok.RequiredArgsConstructor
public class AiGoalController {

    private final AiGoalService aiGoalService;

    /**
     * POST /api/ai/goals/suggest
     * Generate AI-powered goal suggestions
     * 
     * @param user    Authenticated user (injected by Spring Security)
     * @param request Goal suggestion request
     * @return AI-generated suggestions
     */
    @PostMapping("/suggest")
    public ResponseEntity<GoalSuggestionResponse> suggestGoal(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody GoalSuggestionRequest request) {

        GoalSuggestionResponse response = aiGoalService.suggestGoal(request, user);
        return ResponseEntity.ok(response);
    }
}
