package com.drms.drms_backend.ai.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Response DTO for AI Daily Review feature
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyReviewResponse {

    private String summary;
    private Integer productivityScore;
    private String suggestion;
}
