package com.drms.drms_backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "weekly_reviews", indexes = {
    @Index(name = "idx_weekly_reviews_user_start", columnList = "userId, startDate")
})
public class WeeklyReview {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    private LocalDate startDate;
    private LocalDate endDate;

    private double averageMoodScore; // 1.0 to 5.0
    private String moodTrend; // "IMPROVING", "DECLINING", "STABLE"

    private int totalEntries;

    @Column(columnDefinition = "TEXT")
    private String keyThemes; // Comma separated keywords

    @OneToMany(mappedBy = "weeklyReview", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ReviewInsight> insights = new ArrayList<>();

    // Standard Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public double getAverageMoodScore() {
        return averageMoodScore;
    }

    public void setAverageMoodScore(double averageMoodScore) {
        this.averageMoodScore = averageMoodScore;
    }

    public String getMoodTrend() {
        return moodTrend;
    }

    public void setMoodTrend(String moodTrend) {
        this.moodTrend = moodTrend;
    }

    public int getTotalEntries() {
        return totalEntries;
    }

    public void setTotalEntries(int totalEntries) {
        this.totalEntries = totalEntries;
    }

    public String getKeyThemes() {
        return keyThemes;
    }

    public void setKeyThemes(String keyThemes) {
        this.keyThemes = keyThemes;
    }

    public List<ReviewInsight> getInsights() {
        return insights;
    }

    public void setInsights(List<ReviewInsight> insights) {
        this.insights = insights;
    }

    public void addInsight(ReviewInsight insight) {
        this.insights.add(insight);
        insight.setWeeklyReview(this);
    }
}
