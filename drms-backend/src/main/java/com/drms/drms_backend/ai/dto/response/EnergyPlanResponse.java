package com.drms.drms_backend.ai.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnergyPlanResponse {
    private List<ScheduledTask> schedule;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScheduledTask {
        private String taskId;
        private String suggestedTime;
        private String reason;
    }
}
