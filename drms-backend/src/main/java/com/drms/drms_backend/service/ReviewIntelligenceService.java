package com.drms.drms_backend.service;

import com.drms.drms_backend.dto.DailyReviewDTO;
import com.drms.drms_backend.entity.Goal;
import com.drms.drms_backend.entity.Routine;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.model.ReviewInsight;
import com.drms.drms_backend.model.ReviewInsight.InsightType;
import com.drms.drms_backend.repository.GoalRepository;
import com.drms.drms_backend.repository.RoutineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReviewIntelligenceService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private RoutineRepository routineRepository;

    public List<ReviewInsight> generateInsights(List<DailyReviewDTO> reviews, User user) {
        List<ReviewInsight> insights = new ArrayList<>();

        if (reviews.isEmpty())
            return insights;

        // 1. Energy Analysis
        long lowEnergyCount = reviews.stream()
                .filter(r -> "LOW".equalsIgnoreCase(r.getEnergyLevel()))
                .count();

        if (lowEnergyCount > reviews.size() * 0.4) {
            ReviewInsight insight = new ReviewInsight();
            insight.setType(InsightType.ROUTINE_ADJUSTMENT);
            insight.setMessage(
                    "You've had low energy for a significant part of the week. Consider adjusting your morning routine to include more rest or hydration.");
            insight.setActionable(true);

            // Try to link a routine
            List<Routine> routines = routineRepository.findByUserId(user.getId());
            if (!routines.isEmpty()) {
                insight.setLinkedEntityId(routines.get(0).getId());
                insight.setMessage(insight.getMessage() + " check your '" + routines.get(0).getTitle() + "' routine.");
            }
            insights.add(insight);
        }

        // 2. Mood & Goal Alignment
        long sadCount = reviews.stream()
                .filter(r -> "SAD".equalsIgnoreCase(r.getMood()) || "VERY_SAD".equalsIgnoreCase(r.getMood()))
                .count();

        if (sadCount > 1) {
            ReviewInsight insight = new ReviewInsight();
            insight.setType(InsightType.GOAL_ALIGNMENT);
            insight.setMessage(
                    "It's been a tough week. Revisit your active goals to ensure they align with your current capacity.");
            insight.setActionable(true);

            // Link an active goal
            List<Goal> goals = goalRepository.findByUser(user); // Assuming findByUser exists
            // Filter for IN_PROGRESS if possible, but basic list is fine
            if (!goals.isEmpty()) {
                insight.setLinkedEntityId(goals.get(0).getId()); // Link first goal as example
                insight.setMessage(insight.getMessage() + " specifically '" + goals.get(0).getTitle() + "'.");
            }
            insights.add(insight);
        }

        // 3. Keyword Analysis for "Difficulties"
        boolean strugglingWithTime = reviews.stream()
                .anyMatch(r -> r.getDifficulties() != null &&
                        (r.getDifficulties().toLowerCase().contains("time") ||
                                r.getDifficulties().toLowerCase().contains("busy") ||
                                r.getDifficulties().toLowerCase().contains("late")));

        if (strugglingWithTime) {
            ReviewInsight insight = new ReviewInsight();
            insight.setType(InsightType.ROUTINE_ADJUSTMENT);
            insight.setMessage(
                    "Time management seems to be a recurring theme. Try simplifying your daily task list for next week.");
            insight.setActionable(true);
            insights.add(insight);
        }

        return insights;
    }
}
