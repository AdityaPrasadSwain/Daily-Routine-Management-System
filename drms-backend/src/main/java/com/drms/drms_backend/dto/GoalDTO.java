package com.drms.drms_backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class GoalDTO {
    private UUID id;
    private UUID userId;
    private String title;
    private String type;
    private String description;
    private LocalDate targetDate;
    private String status;
    private Integer progress;
}
