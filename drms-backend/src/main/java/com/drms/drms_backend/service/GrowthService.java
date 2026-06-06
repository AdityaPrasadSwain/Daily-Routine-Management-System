package com.drms.drms_backend.service;

import com.drms.drms_backend.entity.GrowthStats;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.repository.GrowthStatsRepository;
import com.drms.drms_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class GrowthService {

    @Autowired
    private GrowthStatsRepository growthStatsRepository;

    @Autowired
    private UserRepository userRepository;

    public GrowthStats getStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return growthStatsRepository.findByUserId(user.getId())
                .map(this::checkDailyReset)
                .orElseGet(() -> createInitialStats(user));
    }

    @Transactional
    public GrowthStats logAvoidance(String email, int minutes) {
        GrowthStats stats = getStats(email);

        // Update minutes
        stats.setTotalAvoidedMinutes(stats.getTotalAvoidedMinutes() + minutes);
        stats.setTodayAvoidedMinutes(stats.getTodayAvoidedMinutes() + minutes);
        stats.setLastLogDate(LocalDate.now());

        // Update score and level
        // 1 minute = 1 point
        int pointsEarned = minutes;
        int currentPointsForNext = stats.getPointsForNextLevel();

        if (pointsEarned >= currentPointsForNext) {
            // Level Up!
            stats.setFocusLevel(stats.getFocusLevel() + 1);
            stats.setGrowthScore(stats.getGrowthScore() + pointsEarned);

            // Calculate remaining points and new target
            int remainingPoints = pointsEarned - currentPointsForNext;
            // Every level requires 50 more points than the previous? Or flat 50?
            // Let's keep it simple: 50 points per level for now, or scaled.
            // Screenshot says "50 pts needed". Let's assume constant 50 for now or slight
            // increase.
            int newLevelTarget = 50 + (stats.getFocusLevel() * 10);
            stats.setPointsForNextLevel(newLevelTarget - remainingPoints);
        } else {
            stats.setGrowthScore(stats.getGrowthScore() + pointsEarned);
            stats.setPointsForNextLevel(currentPointsForNext - pointsEarned);
        }

        return growthStatsRepository.save(stats);
    }

    private GrowthStats checkDailyReset(GrowthStats stats) {
        if (!stats.getLastLogDate().equals(LocalDate.now())) {
            stats.setTodayAvoidedMinutes(0L);
            stats.setLastLogDate(LocalDate.now());
            return growthStatsRepository.save(stats);
        }
        return stats;
    }

    private GrowthStats createInitialStats(User user) {
        GrowthStats stats = new GrowthStats();
        stats.setUser(user);
        stats.setLastLogDate(LocalDate.now());
        // Default values are set in entity
        return growthStatsRepository.save(stats);
    }
}
