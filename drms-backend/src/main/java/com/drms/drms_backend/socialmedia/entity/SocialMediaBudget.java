package com.drms.drms_backend.socialmedia.entity;

import com.drms.drms_backend.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "social_media_budgets", indexes = {
    @Index(name = "idx_social_budgets_user_id", columnList = "user_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialMediaBudget {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private int dailyLimitMinutes; // e.g., 30, 60, 90 minutes

    @Enumerated(EnumType.STRING)
    private ControlMode controlMode;

    private int currentStreakDays;

    private LocalDate lastStreakUpdateDate;

    // Soft delete / reset flag if needed in future
    private boolean isActive;

    @PrePersist
    protected void onCreate() {
        isActive = true;
        if (dailyLimitMinutes == 0) {
            dailyLimitMinutes = 60; // Default 1 hour
        }
        if (controlMode == null) {
            controlMode = ControlMode.SOFT_CONTROL;
        }
    }
}
