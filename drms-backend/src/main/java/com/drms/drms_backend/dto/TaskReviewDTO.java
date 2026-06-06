package com.drms.drms_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TaskReviewDTO {
    private UUID id;
    private UUID taskId;
    private Integer rating;
    private String notes;
    private String mood;
    private LocalDateTime reviewDate;
}
