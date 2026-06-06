package com.drms.drms_backend.socialmedia.dto;

import com.drms.drms_backend.socialmedia.entity.SocialMediaLog;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SocialMediaLogRequest {
    private int minutesSpent;
    private SocialMediaLog.Mood moodBefore; // Optional
    private SocialMediaLog.Mood moodAfter;
    private int productivityImpact; // 1-10
    private SocialMediaLog.TriggerType triggerType;
    private LocalDate date; // Defaults to today if null
    private boolean generateAiInsight; // If true, call AI
}
