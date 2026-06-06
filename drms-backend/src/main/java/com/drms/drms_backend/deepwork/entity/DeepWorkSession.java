package com.drms.drms_backend.deepwork.entity;

import com.drms.drms_backend.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "deep_work_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeepWorkSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private int plannedDurationMinutes;
    private int actualDurationMinutes;

    private int distractionCount;
    private int flowScore; // 0-100 calculated by AI/Algorithm

    @Column(length = 1000)
    private String userNotes; // "Felt great", "Too noisy", etc.

    @Column(length = 1000)
    private String aiFeedback; // "Great consistency. Try blocking notifications next time."
}
