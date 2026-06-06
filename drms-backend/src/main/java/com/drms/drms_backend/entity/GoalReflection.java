package com.drms.drms_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "goal_reflections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoalReflection {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_id", nullable = false)
    private Goal goal;

    @Column(nullable = false)
    private LocalDateTime reflectionDate;

    private Integer score; // 1-10 satisfaction score

    @Column(columnDefinition = "TEXT")
    private String insights; // User's written reflection

    @Column(columnDefinition = "TEXT")
    private String obstacles; // specific challenges faced

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (reflectionDate == null) {
            reflectionDate = LocalDateTime.now();
        }
    }
}
