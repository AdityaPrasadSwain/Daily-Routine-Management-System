package com.drms.drms_backend.ai.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopTasksResponse {
    private List<TopTask> top3Tasks;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopTask {
        private String id;
        private String reason;
    }
}
