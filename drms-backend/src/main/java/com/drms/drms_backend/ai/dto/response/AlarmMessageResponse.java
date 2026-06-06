package com.drms.drms_backend.ai.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Response DTO for AI Alarm Message feature
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlarmMessageResponse {

    private String message;
}
