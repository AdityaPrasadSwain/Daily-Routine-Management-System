package com.drms.drms_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "task_alarms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskAlarm {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private RoutineTask task;

    @Column(name = "alarm_time", nullable = false)
    private LocalDateTime alarmTime;

    @Column(name = "remind_before_minutes")
    private Integer remindBeforeMinutes;

    @Column(name = "voice_type")
    private String voiceType; // TTS or RECORDED

    @Column(name = "voice_text")
    private String voiceText;

    @Column(name = "sound_file")
    private String soundFile;

    @Column(name = "alarm_sound")
    private String alarmSound = "default";

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
