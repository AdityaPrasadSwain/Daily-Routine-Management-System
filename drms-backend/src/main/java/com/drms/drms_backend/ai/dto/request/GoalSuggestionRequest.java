package com.drms.drms_backend.ai.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Request DTO for AI Goal Suggestion feature
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoalSuggestionRequest {

    @NotBlank(message = "Goal title is required")
    private String title;

    private String description;
}
