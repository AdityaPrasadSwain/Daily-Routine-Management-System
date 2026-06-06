package com.drms.drms_backend.ai.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FocusScoreResponse {
    private int score; // 0-100
    private String trend; // UP, DOWN, STABLE
    private String explanation;
    private boolean driftDetected;
    private int mentalLoadScore; // 0-100
}
