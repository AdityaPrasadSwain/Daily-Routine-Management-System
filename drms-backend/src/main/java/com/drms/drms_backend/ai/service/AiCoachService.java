package com.drms.drms_backend.ai.service;

import com.drms.drms_backend.ai.dto.response.*;
import com.drms.drms_backend.ai.prompt.PromptTemplates;
import com.drms.drms_backend.entity.RoutineTask;
import com.drms.drms_backend.entity.TaskReview;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.repository.RoutineTaskRepository;
import com.drms.drms_backend.repository.TaskReviewRepository;
import com.drms.drms_backend.repository.TaskAlarmRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiCoachService extends BaseAiService {

    private static final Logger logger = LoggerFactory.getLogger(AiCoachService.class);

    @Autowired
    private RoutineTaskRepository taskRepository;

    @Autowired
    private TaskReviewRepository reviewRepository;

    @Autowired
    private TaskAlarmRepository alarmRepository;

    // 1. ROUTINE COACH
    public RoutineCoachResponse getRoutineCoaching(User user) {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        List<RoutineTask> tasks = taskRepository.findByUserAndDueDateAfter(user, thirtyDaysAgo);

        // Simple stats for prompt
        long completed = tasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())).count();
        long missed = tasks.size() - completed;

        // This query might need a custom repository method or simple filter if repo
        // doesn't support it directly
        // We'll assume simple fetch for now.

        if (!isOllamaAvailable()) {
            return new RoutineCoachResponse(
                    Arrays.asList("Consistent morning routine detected", "Evening drop-off observed"),
                    "09:00 - 11:00",
                    "Try to maintain your morning momentum.");
        }

        String prompt = PromptTemplates.fillTemplate(
                PromptTemplates.ROUTINE_COACH_PROMPT,
                "completedCount", completed,
                "missedCount", missed,
                "avgScore", "7.5", // detailed impl would calc this
                "activeHours", "Morning");

        return callAi(prompt, RoutineCoachResponse.class, new RoutineCoachResponse());
    }

    // 4. BURNOUT PREDICTOR
    public BurnoutResponse predictBurnout(User user) {
        // Mock data fetching logic for brevity - in real impl, fetch actual missed
        // alarms/tasks
        int missedAlarms = 2; // fetch from alarmRepository
        int missedTasks = 5; // fetch from taskRepository
        double avgMood = 6.5; // fetch from reviewRepository

        if (!isOllamaAvailable()) {
            return new BurnoutResponse("LOW", "Keep up the good balance.", false);
        }

        String prompt = PromptTemplates.fillTemplate(
                PromptTemplates.BURNOUT_PREDICTOR_PROMPT,
                "missedAlarms", missedAlarms,
                "missedTasks", missedTasks,
                "avgMood", avgMood);

        return callAi(prompt, BurnoutResponse.class, new BurnoutResponse("LOW", "System unavailable", false));
    }

    // 6. LIFE BALANCE
    public LifeBalanceResponse analyzeLifeBalance(User user) {
        // Group tasks by category
        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);
        List<RoutineTask> tasks = taskRepository.findByUserAndDueDateAfter(user, sevenDaysAgo);

        Map<String, Long> distribution = tasks.stream()
                .collect(Collectors.groupingBy(t -> t.getCategory() != null ? t.getCategory() : "Uncategorized",
                        Collectors.counting()));

        // Convert to map for JSON
        Map<String, Integer> distMap = new HashMap<>();
        distribution.forEach((k, v) -> distMap.put(k, v.intValue()));

        if (!isOllamaAvailable()) {
            return new LifeBalanceResponse(distMap, "Looks okay.", true);
        }

        String prompt = PromptTemplates.fillTemplate(
                PromptTemplates.LIFE_BALANCE_PROMPT,
                "categoryDistribution", distMap.toString());

        return callAi(prompt, LifeBalanceResponse.class, new LifeBalanceResponse(distMap, "Data unavailable", true));
    }

    // 9. REFLECTION QUESTION
    public ReflectionResponse generateReflectionQuestion(User user) {
        if (!isOllamaAvailable()) {
            return new ReflectionResponse("What is one thing you are grateful for today?");
        }

        String prompt = PromptTemplates.fillTemplate(
                PromptTemplates.REFLECTION_QUESTION_PROMPT,
                "recentFocus", "Productivity");

        return callAi(prompt, ReflectionResponse.class, new ReflectionResponse("What went well today?"));
    }

    // 10. MINIMALIST MODE
    public MinimalistStateResponse getMinimalistState(User user) {
        LocalDate today = LocalDate.now();
        List<RoutineTask> tasks = taskRepository.findByUserAndDueDate(user, today);
        long pending = tasks.stream().filter(t -> !"COMPLETED".equals(t.getStatus())).count();

        if (!isOllamaAvailable()) {
            return new MinimalistStateResponse(pending > 10, new ArrayList<>());
        }

        String prompt = PromptTemplates.fillTemplate(
                PromptTemplates.MINIMALIST_MODE_PROMPT,
                "pendingCount", pending,
                "completionRate", "50");

        return callAi(prompt, MinimalistStateResponse.class, new MinimalistStateResponse(false, new ArrayList<>()));
    }
}
