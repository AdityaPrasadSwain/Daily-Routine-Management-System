package com.drms.drms_backend.ai.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalTime;

/**
 * Request DTO for AI Alarm Message feature
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlarmMessageRequest {

    @NotBlank(message = "Task title is required")
    private String taskTitle;

    @NotNull(message = "Time is required")
    private LocalTime time;

    @NotBlank(message = "Alarm type is required")
    private String alarmType; // MORNING, AFTERNOON, EVENING
}
