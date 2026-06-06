package com.drms.drms_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "daily_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyReview {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    // Mood: "VERY_HAPPY", "HAPPY", "NEUTRAL", "SAD", "VERY_SAD"
    private String mood;

    @Column(columnDefinition = "TEXT")
    private String wentWell;

    @Column(columnDefinition = "TEXT")
    private String difficulties;

    @Column(columnDefinition = "TEXT")
    private String improveTomorrow;

    // Energy: "LOW", "MEDIUM", "HIGH"
    private String energyLevel;

    @Column(columnDefinition = "TEXT")
    private String suggestedAction;
}
