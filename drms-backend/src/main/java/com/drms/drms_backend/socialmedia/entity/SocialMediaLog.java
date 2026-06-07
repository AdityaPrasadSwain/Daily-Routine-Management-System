package com.drms.drms_backend.socialmedia.entity;

import com.drms.drms_backend.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "social_media_logs", indexes = {
    @Index(name = "idx_social_logs_user_id", columnList = "user_id"),
    @Index(name = "idx_social_logs_user_date", columnList = "user_id, date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialMediaLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private int minutesSpent;

    @Enumerated(EnumType.STRING)
    private Mood moodBefore;

    @Enumerated(EnumType.STRING)
    private Mood moodAfter;

    // 1-10 scale rating
    private Integer productivityImpact;

    @Enumerated(EnumType.STRING)
    private TriggerType triggerType;

    @Column(length = 500)
    private String aiInsight;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (date == null) {
            date = LocalDate.now();
        }
    }

    public enum Mood {
        BORED, STRESSED, SAD, HAPPY, NEUTRAL, ANXIOUS, TIRED
    }

    public enum TriggerType {
        BOREDOM, STRESS, FOMO, HABIT, NOTIFICATION, PROCRASTINATION, FREE_TIME
    }
}
