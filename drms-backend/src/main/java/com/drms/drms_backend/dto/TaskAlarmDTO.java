package com.drms.drms_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TaskAlarmDTO {
    private UUID id;
    private UUID taskId;
    private LocalDateTime alarmTime;
    private Integer remindBeforeMinutes;
    private String voiceType;
    private String voiceText;
    private String soundFile;
    private String alarmSound;
    private Boolean isActive;
}
