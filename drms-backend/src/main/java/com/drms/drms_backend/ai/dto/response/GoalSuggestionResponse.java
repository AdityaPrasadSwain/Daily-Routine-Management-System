package com.drms.drms_backend.ai.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

/**
 * Response DTO for AI Goal Suggestion feature
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoalSuggestionResponse {

    private String improvedTitle;
    private String improvedDescription;
    private List<String> subGoals;
    private String suggestedDuration;
    private String durationReason;
}
