package com.drms.drms_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class RoutineDTO {
    private UUID id;
    private UUID userId;
    private String title;
    private String description;
    private LocalDateTime createdAt;
}
