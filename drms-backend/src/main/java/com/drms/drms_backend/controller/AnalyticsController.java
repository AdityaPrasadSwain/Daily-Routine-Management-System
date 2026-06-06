package com.drms.drms_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AnalyticsController {

    @Autowired
    private com.drms.drms_backend.repository.RoutineTaskRepository taskRepository;

    @Autowired
    private com.drms.drms_backend.repository.GoalRepository goalRepository;

    @Autowired
    private com.drms.drms_backend.repository.UserRepository userRepository;

    // Matches /api/dashboard/stats
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.drms.drms_backend.entity.User user) {
        if (user == null)
            return ResponseEntity.status(401).build();

        Map<String, Object> stats = new HashMap<>();

        // Fetch real data
        java.util.List<com.drms.drms_backend.entity.RoutineTask> tasks = taskRepository.findByUserId(user.getId());
        long totalTasks = tasks.size();
        long completedTasks = tasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())).count();
        long overdueTasks = tasks.stream().filter(t -> t.getDueDate() != null
                && t.getDueDate().isBefore(java.time.LocalDate.now()) && !"COMPLETED".equals(t.getStatus())).count();

        stats.put("totalTasks", totalTasks);
        stats.put("completedTasks", completedTasks);
        stats.put("overdueTasks", overdueTasks);
        stats.put("totalGoals", goalRepository.findByUser(user).size());
        stats.put("totalFocusTimeSeconds", tasks.stream()
                .mapToLong(t -> t.getTotalFocusTimeSeconds() != null ? t.getTotalFocusTimeSeconds() : 0).sum());

        // Avoid division by zero
        if (totalTasks > 0) {
            stats.put("completionRate", (double) completedTasks / totalTasks * 100);
        } else {
            stats.put("completionRate", 0.0);
        }

        // Check if correct methods exist in repository, if not basic calc
        stats.put("tasksCompletedToday", tasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())
                && t.getUpdatedAt().toLocalDate().equals(java.time.LocalDate.now())).count());
        stats.put("tasksDueToday", tasks.stream()
                .filter(t -> t.getDueDate() != null && t.getDueDate().equals(java.time.LocalDate.now())).count());

        // Category Distribution
        Map<String, Integer> categoryDistribution = new HashMap<>();
        tasks.forEach(t -> {
            String cat = t.getCategory() != null ? t.getCategory() : "Uncategorized";
            categoryDistribution.put(cat, categoryDistribution.getOrDefault(cat, 0) + 1);
        });
        stats.put("categoryDistribution", categoryDistribution);

        // Weekly Activity (Simplified for now, can be optimized with DB query)
        java.util.List<Map<String, Object>> weeklyActivity = new java.util.ArrayList<>();
        java.time.LocalDate today = java.time.LocalDate.now();
        for (int i = 0; i < 7; i++) {
            java.time.LocalDate date = today.minusDays(6 - i);
            Map<String, Object> day = new HashMap<>();
            day.put("date", date.toString());
            long count = tasks.stream()
                    .filter(t -> t.getUpdatedAt().toLocalDate().equals(date) && "COMPLETED".equals(t.getStatus()))
                    .count();
            day.put("tasksCompleted", count);
            weeklyActivity.add(day);
        }
        stats.put("weeklyActivity", weeklyActivity);

        return ResponseEntity.ok(stats);
    }

    // Matches /api/tasks/analytics/weekly
    // Matches /api/tasks/analytics/weekly
    @GetMapping("/tasks/analytics/weekly")
    public ResponseEntity<java.util.List<Map<String, Object>>> getWeeklyAnalytics(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.drms.drms_backend.entity.User user) {
        if (user == null)
            return ResponseEntity.status(401).build();

        java.util.List<com.drms.drms_backend.entity.RoutineTask> tasks = taskRepository.findByUserId(user.getId());
        java.util.List<Map<String, Object>> weeklyData = new java.util.ArrayList<>();
        java.time.LocalDate today = java.time.LocalDate.now();

        for (int i = 6; i >= 0; i--) {
            java.time.LocalDate date = today.minusDays(i);
            Map<String, Object> dayStat = new HashMap<>();
            dayStat.put("date", date.toString());

            // Calculate daily progress/stats
            long completed = tasks.stream()
                    .filter(t -> t.getUpdatedAt().toLocalDate().equals(date) && "COMPLETED".equals(t.getStatus()))
                    .count();
            long totalDue = tasks.stream()
                    .filter(t -> t.getDueDate() != null && t.getDueDate().equals(date))
                    .count();

            // Avoid division by zero, simplistic progress for now
            double avgProgress = totalDue > 0 ? (double) completed / totalDue * 100 : 0.0;
            if (totalDue == 0 && completed > 0)
                avgProgress = 100.0; // Bonus if completed tasks without due date today?

            dayStat.put("avgProgress", avgProgress);
            dayStat.put("completedTasks", completed);
            weeklyData.add(dayStat);
        }

        return ResponseEntity.ok(weeklyData);
    }
}
