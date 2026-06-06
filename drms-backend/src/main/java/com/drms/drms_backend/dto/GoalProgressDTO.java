package com.drms.drms_backend.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class GoalProgressDTO {
    private UUID goalId;
    private Integer progressPercentage;
    private Integer completedTasks;
    private Integer totalTasks;
    private String status; // NOT_STARTED, IN_PROGRESS, NEAR_COMPLETION, COMPLETED
    private List<TaskDTO> tasks;
    private String aiInsight;
}
