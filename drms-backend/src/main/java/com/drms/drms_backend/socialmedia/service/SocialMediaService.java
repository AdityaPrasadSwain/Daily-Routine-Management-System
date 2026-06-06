package com.drms.drms_backend.socialmedia.service;

import com.drms.drms_backend.ai.prompt.PromptTemplates;
import com.drms.drms_backend.ai.service.BaseAiService;
import com.drms.drms_backend.socialmedia.dto.SocialAiInsightResponse;
import com.drms.drms_backend.socialmedia.dto.SocialMediaLogRequest;
import com.drms.drms_backend.socialmedia.dto.SocialMediaStatusResponse;
import com.drms.drms_backend.socialmedia.entity.SocialMediaBudget;
import com.drms.drms_backend.socialmedia.entity.SocialMediaLog;
import com.drms.drms_backend.socialmedia.repository.SocialMediaBudgetRepository;
import com.drms.drms_backend.socialmedia.repository.SocialMediaLogRepository;
import com.drms.drms_backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient; // Correct import for Spring AI 1.0.0-M4+
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SocialMediaService extends BaseAiService {

    private final SocialMediaLogRepository logRepository;
    private final SocialMediaBudgetRepository budgetRepository;

    @Transactional
    public SocialMediaLog logUsage(User user, SocialMediaLogRequest request) {
        SocialMediaLog log = SocialMediaLog.builder()
                .user(user)
                .date(request.getDate() != null ? request.getDate() : LocalDate.now())
                .minutesSpent(request.getMinutesSpent())
                .moodBefore(request.getMoodBefore())
                .moodAfter(request.getMoodAfter())
                .productivityImpact(request.getProductivityImpact())
                .triggerType(request.getTriggerType())
                .build();

        if (request.isGenerateAiInsight()) {
            // Fetch mode for accurate insight
            com.drms.drms_backend.socialmedia.entity.ControlMode mode = budgetRepository.findByUser(user)
                    .map(SocialMediaBudget::getControlMode)
                    .orElse(com.drms.drms_backend.socialmedia.entity.ControlMode.SOFT_CONTROL);

            String insight = generateLogInsight(request, mode);
            log.setAiInsight(insight);
        }

        SocialMediaLog savedLog = logRepository.save(log);
        updateStreak(user);
        return savedLog;
    }

    @Transactional(readOnly = true)
    public SocialMediaStatusResponse getStatus(User user) {
        SocialMediaBudget budget = budgetRepository.findByUser(user)
                .orElse(SocialMediaBudget.builder()
                        .user(user)
                        .dailyLimitMinutes(60)
                        .currentStreakDays(0)
                        .controlMode(com.drms.drms_backend.socialmedia.entity.ControlMode.SOFT_CONTROL)
                        .build());

        if (budget.getId() == null) {
            budgetRepository.save(budget);
        }

        List<SocialMediaLog> todayLogs = logRepository.findByUserAndDate(user, LocalDate.now());
        int usedMinutes = todayLogs.stream().mapToInt(SocialMediaLog::getMinutesSpent).sum();
        int remaining = Math.max(0, budget.getDailyLimitMinutes() - usedMinutes);

        return SocialMediaStatusResponse.builder()
                .dailyLimitMinutes(budget.getDailyLimitMinutes())
                .usedMinutes(usedMinutes)
                .remainingMinutes(remaining)
                .isOverLimit(usedMinutes > budget.getDailyLimitMinutes())
                .currentStreakDays(budget.getCurrentStreakDays())
                .controlMode(budget.getControlMode())
                .motivationMessage(generateMotivationMessage(budget, usedMinutes, remaining))
                .build();
    }

    private String generateMotivationMessage(SocialMediaBudget budget, int used, int remaining) {
        boolean over = used > budget.getDailyLimitMinutes();
        switch (budget.getControlMode()) {
            case STRONG_DISCIPLINE:
                return over ? "LIMIT EXCEEDED. CLOSE THE APP NOW." : "Stay focused. " + remaining + "m remains.";
            case AI_PSYCHOLOGY:
                return over ? "Why are you escaping reality?" : "Conscious usage is key.";
            case STUDENT_FOCUS:
                return over ? "Go back to study." : "Save this time for revision.";
            case SOCIAL_DETOX:
                return "Nature is waiting.";
            default: // SOFT
                return over ? "Maybe take a break?" : remaining + " mins left.";
        }
    }

    @Transactional
    public SocialMediaBudget setLimit(User user, int minutes) {
        SocialMediaBudget budget = budgetRepository.findByUser(user)
                .orElse(SocialMediaBudget.builder().user(user).currentStreakDays(0).build());
        budget.setDailyLimitMinutes(minutes);
        return budgetRepository.save(budget);
    }

    @Transactional
    public SocialMediaBudget setControlMode(User user, com.drms.drms_backend.socialmedia.entity.ControlMode mode) {
        SocialMediaBudget budget = budgetRepository.findByUser(user)
                .orElse(SocialMediaBudget.builder().user(user).currentStreakDays(0).build());
        budget.setControlMode(mode);
        return budgetRepository.save(budget);
    }

    // AI METHODS

    public SocialAiInsightResponse getReplacementTask(User user, String trigger) {
        if (!isOllamaAvailable()) {
            return SocialAiInsightResponse.builder()
                    .insight("Ollama unavailable.")
                    .replacementTask("Read 2 pages of a book.")
                    .build();
        }

        com.drms.drms_backend.socialmedia.entity.ControlMode mode = budgetRepository.findByUser(user)
                .map(SocialMediaBudget::getControlMode)
                .orElse(com.drms.drms_backend.socialmedia.entity.ControlMode.SOFT_CONTROL);

        String prompt = PromptTemplates.fillTemplate(
                PromptTemplates.SOCIAL_REPLACEMENT_TASK_PROMPT,
                "trigger", trigger != null ? trigger : "bored",
                "mode", mode.name());

        // Direct builder usage for text response
        ChatClient client = chatClientBuilder.build();
        String response = client.prompt().user(prompt).call().content();

        return SocialAiInsightResponse.builder()
                .replacementTask(response != null ? response.trim() : "Take a deep breath.")
                .build();
    }

    public SocialAiInsightResponse analyzeTrigger(User user, String trigger) {
        // Keeping analysis generic for now, or could pipe mode here too
        if (!isOllamaAvailable()) {
            return SocialAiInsightResponse.builder()
                    .insight("You are likely seeking a quick dopamine hit. Try deep breathing.").build();
        }

        String prompt = PromptTemplates.fillTemplate(
                PromptTemplates.SOCIAL_TRIGGER_ANALYSIS_PROMPT,
                "trigger", trigger);

        // Use BaseAiService's JSON parsing capability
        SocialAiInsightResponse response = callAi(prompt, SocialAiInsightResponse.class,
                SocialAiInsightResponse.builder().insight("Trigger analysis unavailable").build());

        return response;
    }

    private String generateLogInsight(SocialMediaLogRequest request,
            com.drms.drms_backend.socialmedia.entity.ControlMode mode) {
        if (!isOllamaAvailable())
            return "Usage logged. Try to reduce time tomorrow!";

        String prompt = PromptTemplates.fillTemplate(
                PromptTemplates.SOCIAL_LOG_INSIGHT_PROMPT,
                "minutes", request.getMinutesSpent(),
                "moodBefore", request.getMoodBefore(),
                "moodAfter", request.getMoodAfter(),
                "impact", request.getProductivityImpact(),
                "mode", mode.name());

        ChatClient client = chatClientBuilder.build();
        String response = client.prompt().user(prompt).call().content();

        return response != null ? response.trim() : "Insight unavailable";
    }

    private void updateStreak(User user) {
        // Placeholder for streak logic
        // Ideally: Check if yesterday was valid, if so check today, update streak
        // count.
    }
}
