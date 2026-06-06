package com.drms.drms_backend.controller;

import com.drms.drms_backend.dto.DailyReviewDTO;
import com.drms.drms_backend.dto.TaskReviewDTO;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.model.WeeklyReview;
import com.drms.drms_backend.service.DailyReviewService;
import com.drms.drms_backend.service.WeeklyReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private com.drms.drms_backend.repository.RoutineTaskRepository taskRepository;

    @Autowired
    private DailyReviewService dailyReviewService;

    @Autowired
    private WeeklyReviewService weeklyReviewService;

    // --- DAILY REVIEWS ---

    @PostMapping("/daily")
    public ResponseEntity<DailyReviewDTO> submitDailyReview(
            @AuthenticationPrincipal User user,
            @RequestBody DailyReviewDTO reviewDTO) {
        if (user == null)
            return ResponseEntity.status(401).build();
        DailyReviewDTO saved = dailyReviewService.saveDailyReview(reviewDTO, user);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/daily/today")
    public ResponseEntity<DailyReviewDTO> getTodayReview(@AuthenticationPrincipal User user) {
        if (user == null)
            return ResponseEntity.status(401).build();
        return dailyReviewService.getReviewForToday(user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    // Kept for backward compatibility but using the new DailyReview entity
    @GetMapping("/daily")
    public ResponseEntity<List<DailyReviewDTO>> getRecentDailyReviews(@AuthenticationPrincipal User user) {
        if (user == null)
            return ResponseEntity.status(401).build();
        // Returning weekly summary as "daily" list
        return ResponseEntity.ok(dailyReviewService.getWeeklyReviews(user));
    }

    @GetMapping("/weekly-summary")
    public ResponseEntity<List<DailyReviewDTO>> getWeeklySummary(@AuthenticationPrincipal User user) {
        if (user == null)
            return ResponseEntity.status(401).build();
        return ResponseEntity.ok(dailyReviewService.getWeeklyReviews(user));
    }

    @GetMapping("/streak")
    public ResponseEntity<Integer> getStreak(@AuthenticationPrincipal User user) {
        if (user == null)
            return ResponseEntity.status(401).build();
        return ResponseEntity.ok(dailyReviewService.calculateCurrentStreak(user));
    }

    // --- WEEKLY REVIEW REPORT ---

    @PostMapping("/weekly/generate")
    public ResponseEntity<WeeklyReview> generateWeeklyReport(@AuthenticationPrincipal User user) {
        if (user == null)
            return ResponseEntity.status(401).build();
        WeeklyReview report = weeklyReviewService.generateWeeklyReview(user);
        if (report == null)
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(report);
    }

    @GetMapping("/weekly/latest")
    public ResponseEntity<WeeklyReview> getLatestWeeklyReport(@AuthenticationPrincipal User user) {
        if (user == null)
            return ResponseEntity.status(401).build();
        return weeklyReviewService.getLatestWeeklyReview(user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    // --- TASK REVIEWS (Keep existing) ---

    @GetMapping("/task/{taskId}")
    public ResponseEntity<TaskReviewDTO> getReview(@PathVariable UUID taskId) {
        TaskReviewDTO dto = new TaskReviewDTO();
        dto.setTaskId(taskId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<String> submitReview(@RequestBody TaskReviewDTO reviewDTO) {
        return ResponseEntity.ok("Review submitted");
    }
}
