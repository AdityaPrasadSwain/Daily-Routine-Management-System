package com.drms.drms_backend.service;

import com.drms.drms_backend.dto.DailyReviewDTO;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.model.ReviewInsight;
import com.drms.drms_backend.model.WeeklyReview;
import com.drms.drms_backend.repository.WeeklyReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WeeklyReviewService {

    @Autowired
    private WeeklyReviewRepository weeklyReviewRepository;

    @Autowired
    private DailyReviewService dailyReviewService;

    @Autowired
    private ReviewIntelligenceService reviewIntelligenceService;

    @Transactional
    public WeeklyReview generateWeeklyReview(User user) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(6);

        // Check if already exists for this week start
        Optional<WeeklyReview> existing = weeklyReviewRepository.findByUserIdAndStartDate(user.getId(), start);
        if (existing.isPresent()) {
            return existing.get(); // Return existing summary
        }

        List<DailyReviewDTO> reviews = dailyReviewService.getWeeklyReviews(user);

        if (reviews.isEmpty()) {
            return null; // Not enough data
        }

        WeeklyReview summary = new WeeklyReview();
        summary.setUserId(user.getId());
        summary.setStartDate(start);
        summary.setEndDate(end);
        summary.setTotalEntries(reviews.size());

        // Calculate Mood Score
        double avgMood = calculateAvgMood(reviews);
        summary.setAverageMoodScore(avgMood);
        summary.setMoodTrend(calculateMoodTrend(reviews));

        // Keywords
        String themes = extractKeyThemes(reviews);
        summary.setKeyThemes(themes);

        // Generate Insights
        List<ReviewInsight> insights = reviewIntelligenceService.generateInsights(reviews, user);
        for (ReviewInsight insight : insights) {
            summary.addInsight(insight);
        }

        return weeklyReviewRepository.save(summary);
    }

    public Optional<WeeklyReview> getLatestWeeklyReview(User user) {
        return weeklyReviewRepository.findFirstByUserIdOrderByStartDateDesc(user.getId());
    }

    private double calculateAvgMood(List<DailyReviewDTO> reviews) {
        Map<String, Integer> moodScores = Map.of(
                "VERY_SAD", 1,
                "SAD", 2,
                "NEUTRAL", 3,
                "HAPPY", 4,
                "VERY_HAPPY", 5);

        return reviews.stream()
                .mapToInt(r -> moodScores.getOrDefault(r.getMood(), 3))
                .average()
                .orElse(0.0);
    }

    private String calculateMoodTrend(List<DailyReviewDTO> reviews) {
        // Simple first vs last comparison
        if (reviews.size() < 2)
            return "STABLE";

        // Logic incomplete, defaulting to STABLE.
        return "STABLE";
    }

    private String extractKeyThemes(List<DailyReviewDTO> reviews) {
        return reviews.stream()
                .filter(r -> r.getImproveTomorrow() != null)
                .map(DailyReviewDTO::getImproveTomorrow)
                .limit(3)
                .collect(Collectors.joining(", "));
    }
}
