package com.drms.drms_backend.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "review_insights")
public class ReviewInsight {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "weekly_review_id")
    private WeeklyReview weeklyReview;

    @Enumerated(EnumType.STRING)
    private InsightType type;

    @Column(columnDefinition = "TEXT")
    private String message;

    private UUID linkedEntityId; // ID of a Goal or Routine if applicable

    private boolean actionable;

    public enum InsightType {
        ROUTINE_ADJUSTMENT,
        GOAL_ALIGNMENT,
        WELLBEING_CHECK,
        CELEBRATION
    }

    // Standard Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public WeeklyReview getWeeklyReview() {
        return weeklyReview;
    }

    public void setWeeklyReview(WeeklyReview weeklyReview) {
        this.weeklyReview = weeklyReview;
    }

    public InsightType getType() {
        return type;
    }

    public void setType(InsightType type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UUID getLinkedEntityId() {
        return linkedEntityId;
    }

    public void setLinkedEntityId(UUID linkedEntityId) {
        this.linkedEntityId = linkedEntityId;
    }

    public boolean isActionable() {
        return actionable;
    }

    public void setActionable(boolean actionable) {
        this.actionable = actionable;
    }
}
