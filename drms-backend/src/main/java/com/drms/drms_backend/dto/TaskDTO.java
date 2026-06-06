package com.drms.drms_backend.dto;

import lombok.Data;
import java.time.LocalTime;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TaskDTO {
    private UUID id;
    private UUID routineId;
    private UUID userId; // Optional in response, usually implicit
    private String title;
    private String description;
    private String category;
    private UUID goalId;
    private String priority;
    private String status;
    private LocalTime startTime;
    private Integer durationMinutes;
    private LocalDate dueDate;
    private Long totalFocusTimeSeconds;
    private Integer progress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
