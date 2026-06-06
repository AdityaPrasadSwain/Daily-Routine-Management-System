package com.drms.drms_backend.socialmedia.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SocialMediaStatusResponse {
    private int dailyLimitMinutes;
    private int usedMinutes;
    private int remainingMinutes;
    private boolean isOverLimit;
    private int currentStreakDays;
    private com.drms.drms_backend.socialmedia.entity.ControlMode controlMode;
    private String motivationMessage;
}
