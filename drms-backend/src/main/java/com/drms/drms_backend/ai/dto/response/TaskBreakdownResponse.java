package com.drms.drms_backend.ai.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

/**
 * Response DTO for AI Task Breakdown feature
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskBreakdownResponse {

    private List<TaskSuggestion> tasks;

    /**
     * Individual task suggestion
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TaskSuggestion {
        private String title;
        private String priority;
        private Integer estimatedMinutes;
    }
}
