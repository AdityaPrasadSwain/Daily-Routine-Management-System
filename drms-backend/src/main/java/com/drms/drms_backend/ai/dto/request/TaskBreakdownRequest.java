package com.drms.drms_backend.ai.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

/**
 * Request DTO for AI Task Breakdown feature
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskBreakdownRequest {

    @NotBlank(message = "Goal title is required")
    private String goalTitle;

    @NotNull(message = "Target date is required")
    private LocalDate targetDate;
}
