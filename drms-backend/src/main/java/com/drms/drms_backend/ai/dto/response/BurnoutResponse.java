package com.drms.drms_backend.ai.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BurnoutResponse {
    private String riskLevel; // LOW, MEDIUM, HIGH
    private String suggestion;
    private boolean recoveryMode;
}
