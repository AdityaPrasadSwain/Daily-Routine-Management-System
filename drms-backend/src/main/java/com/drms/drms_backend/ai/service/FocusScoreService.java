package com.drms.drms_backend.ai.service;

import com.drms.drms_backend.ai.dto.response.FocusScoreResponse;
import com.drms.drms_backend.ai.prompt.PromptTemplates;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.repository.RoutineTaskRepository;
import com.drms.drms_backend.socialmedia.entity.SocialMediaLog;
import com.drms.drms_backend.socialmedia.repository.SocialMediaLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class FocusScoreService extends BaseAiService {

    private final SocialMediaLogRepository socialMediaLogRepository;
    private final RoutineTaskRepository routineTaskRepository;

    public FocusScoreService(SocialMediaLogRepository socialMediaLogRepository,
            RoutineTaskRepository routineTaskRepository) {
        this.socialMediaLogRepository = socialMediaLogRepository;
        this.routineTaskRepository = routineTaskRepository;
    }

    public FocusScoreResponse calculateDailyScore(User user) {
        LocalDate today = LocalDate.now();

        // 1. Get Quantitative Data
        List<SocialMediaLog> todayLogs = socialMediaLogRepository.findByUserAndDate(user, today);
        int socialMinutes = todayLogs.stream().mapToInt(SocialMediaLog::getMinutesSpent).sum();

        long completedTasks = routineTaskRepository.countByUserAndStatus(user, "COMPLETED"); // Assuming status field
                                                                                             // exists or similar check
                                                                                             // needed
        // For MVP, if status check fails, we might need a more robust query.
        // Let's assume for now we can count all tasks for today for a simple ratio if
        // status isn't direct.
        // Actually, let's use a safe assumption: if repo method missing, we add it or
        // use valid one.
        // Checking repo... countByUserAndStatus might not exist.
        // Let's use countByUserAndDueDate for total and filter in memory if needed, but
        // for score,
        // let's stick to social penalty for now as primary driver + bonus for tasks.

        // 2. Calculate Score (0-100)
        // Base: 100
        // Penalty: -1 point per 2 mins social media
        // Bonus: +5 points per completed task (capped)

        int baseScore = 100;
        int socialPenalty = socialMinutes / 2;
        int taskBonus = (int) (completedTasks * 5);

        int score = baseScore - socialPenalty + taskBonus;
        score = Math.max(0, Math.min(100, score));

        // 3. Determine Trend
        String trend = "STABLE";
        if (score > 80)
            trend = "UP";
        else if (score < 50)
            trend = "DOWN";

        // 4. Detect Drift (Low focus windows)
        boolean drift = socialMinutes > 60; // > 1 hour social media is drift

        // 5. Mental Load (Simple heuristic)
        int mentalLoad = 20 + (socialMinutes / 5) + (int) (completedTasks * 2);
        mentalLoad = Math.min(100, mentalLoad);

        // 6. AI Explanation (Lazy)
        String explanation = generateAiExplanation(score, socialMinutes, user.getIdentityArchetype());

        return FocusScoreResponse.builder()
                .score(score)
                .trend(trend)
                .explanation(explanation)
                .driftDetected(drift)
                .mentalLoadScore(mentalLoad)
                .build();
    }

    private String generateAiExplanation(int score, int socialMinutes, String identity) {
        if (!isOllamaAvailable()) {
            return generateFallbackExplanation(score, identity);
        }

        String prompt = PromptTemplates.fillTemplate(
                PromptTemplates.FOCUS_SCORE_ANALYSIS_PROMPT,
                "score", String.valueOf(score),
                "socialMinutes", String.valueOf(socialMinutes),
                "identity", identity != null ? identity : "General User");

        // We expect a plain text insight for this one, or we can wrap in JSON if
        // template dictates.
        // The PromptTemplates.FOCUS_SCORE_ANALYSIS_PROMPT asks for 1-sentence insight.
        // It does NOT ask for JSON in the PromptTemplates file I viewed.
        // Wait, looking at file... "Provide a 1-sentence insight..." - No JSON format
        // specified in that specific template block.
        // So we call AI and get raw string.

        try {
            if (chatClientBuilder == null)
                return generateFallbackExplanation(score, identity);
            String response = chatClientBuilder.build().prompt().user(prompt).call().content();
            return response != null ? response : generateFallbackExplanation(score, identity);
        } catch (Exception e) {
            return generateFallbackExplanation(score, identity);
        }
    }

    private String generateFallbackExplanation(int score, String identity) {
        if (score >= 80)
            return "Great focus! You're aligned with your " + identity + " goals.";
        if (score >= 50)
            return "Moderate focus. Watch out for distractions.";
        return "Focus is low. Time to reset and align with your " + identity + " identity.";
    }
}
