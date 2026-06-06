package com.drms.drms_backend.service;

import com.drms.drms_backend.entity.Goal;
import com.drms.drms_backend.entity.GoalRoutineLink;
import com.drms.drms_backend.entity.RoutineTask;
import com.drms.drms_backend.repository.GoalRepository;
import com.drms.drms_backend.repository.GoalRoutineLinkRepository; // Need to create this
import com.drms.drms_backend.repository.RoutineTaskRepository; // Need to create/use this
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class GoalIntelligenceService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private GoalRoutineLinkRepository goalRoutineLinkRepository;

    @Autowired
    private RoutineTaskRepository routineTaskRepository;

    public int calculateHealthScore(UUID goalId) {
        // Logic:
        // 1. Get all tasks linked to this goal in the last 7 days.
        // 2. Calculate completion rate.
        // 3. Get all routines linked to this goal.
        // 4. Check if those routines were completed (need routine completion history,
        // but for now let's just use tasks as proxy if routines don't track history
        // directly yet).

        // Simplified Logic for MVP:
        // Health = (Completed Tasks assigned to Goal / Total Tasks assigned to Goal) *
        // 100 (Last 30 days)

        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<RoutineTask> recentTasks = routineTaskRepository.findByGoalIdAndCreatedAtAfter(goalId, thirtyDaysAgo);

        if (recentTasks.isEmpty()) {
            return 50; // Neutral start
        }

        long completedCount = recentTasks.stream()
                .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()))
                .count();

        return (int) ((completedCount * 100) / recentTasks.size());
    }

    public String calculateMomentum(UUID goalId) {
        // Logic: Compare current week completion rate vs last week.
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysAgo = now.minusDays(7);
        LocalDateTime fourteenDaysAgo = now.minusDays(14);

        List<RoutineTask> thisWeekTasks = routineTaskRepository.findByGoalIdAndCreatedAtBetween(goalId, sevenDaysAgo,
                now);
        List<RoutineTask> lastWeekTasks = routineTaskRepository.findByGoalIdAndCreatedAtBetween(goalId, fourteenDaysAgo,
                sevenDaysAgo);

        double thisWeekRate = calculateRate(thisWeekTasks);
        double lastWeekRate = calculateRate(lastWeekTasks);

        if (thisWeekRate > lastWeekRate + 10)
            return "SURGING";
        if (thisWeekRate > lastWeekRate)
            return "IMPROVING";
        if (thisWeekRate < lastWeekRate - 10)
            return "DROPPING";
        if (thisWeekRate < lastWeekRate)
            return "SLIPPING";
        return "STABLE";
    }

    private double calculateRate(List<RoutineTask> tasks) {
        if (tasks.isEmpty())
            return 0.0;
        long completed = tasks.stream().filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus())).count();
        return (double) completed / tasks.size() * 100;
    }

    public List<String> generateInsights(UUID goalId) {
        Goal goal = goalRepository.findById(goalId).orElse(null);
        if (goal == null)
            return List.of();

        List<String> insights = new java.util.ArrayList<>();
        int health = calculateHealthScore(goalId);

        if (health < 30) {
            insights.add("This goal is at risk. Consider breaking it down into smaller tasks.");
        } else if (health > 80) {
            insights.add("You're crushing this goal! Consider increasing the challenge.");
        }

        // Check linked routines
        List<GoalRoutineLink> links = goalRoutineLinkRepository.findByGoalId(goalId);
        if (links.isEmpty()) {
            insights.add("Linking a daily routine to this goal can increase success rate by 40%.");
        }

        return insights;
    }
}
