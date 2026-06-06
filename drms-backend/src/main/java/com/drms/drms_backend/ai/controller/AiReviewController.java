package com.drms.drms_backend.ai.controller;

import com.drms.drms_backend.ai.dto.response.DailyReviewResponse;
import com.drms.drms_backend.ai.service.AiReviewService;
import com.drms.drms_backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for AI Daily Review features
 */
@RestController
@RequestMapping("/api/ai/review")
public class AiReviewController {

    @Autowired
    private AiReviewService aiReviewService;

    /**
     * GET /api/ai/review/daily
     * Generate AI-powered daily review based on user's task completion
     * 
     * @param user Authenticated user (injected by Spring Security)
     * @return AI-generated daily review
     */
    @GetMapping("/daily")
    public ResponseEntity<DailyReviewResponse> getDailyReview(
            @AuthenticationPrincipal User user) {

        DailyReviewResponse response = aiReviewService.generateDailyReview(user);
        return ResponseEntity.ok(response);
    }
}
