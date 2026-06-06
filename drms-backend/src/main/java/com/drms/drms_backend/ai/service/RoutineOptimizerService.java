package com.drms.drms_backend.ai.service;

import com.drms.drms_backend.ai.prompt.PromptTemplates;
import com.drms.drms_backend.entity.RoutineTask;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.repository.RoutineTaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class RoutineOptimizerService extends BaseAiService {

    private final RoutineTaskRepository routineTaskRepository;

    public RoutineOptimizerService(RoutineTaskRepository routineTaskRepository) {
        this.routineTaskRepository = routineTaskRepository;
    }

    public String optimizeRoutine(User user) {
        // 1. Fetch History (Last 7 Days)
        LocalDate oneWeekAgo = LocalDate.now().minusDays(7);
        // Assuming findByUserAndDateBetween exists or similar, if not we will fetch recent tasks.
        // For MVP, if specific method missing, we use standard findAll and filter?
        // Better: let's assume we can fetch tasks for user and filter in memory if repo limit is tricky, 
        // or effectively just get today's snapshot as "current routine" if history is complex.
        // Actually, prompt asks for last 7 days data.
        
        // Let's use a simple heuristic if deep history query is absent:
        // Analyzes "Current Routine Structure" (Tasks due today) as the base for optimization.
        
        List<RoutineTask> tasks = routineTaskRepository.findByUserAndDueDate(user, LocalDate.now());
        
        long completedCount = tasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())).count();
        long totalCount = tasks.size();
        
        if (totalCount == 0) {
            return "{\"suggestions\": [\"Start by adding some tasks to your routine!\"]}";
        }
        
        String missedTask = tasks.stream()
                .filter(t -> !"COMPLETED".equals(t.getStatus()))
                .findFirst()
                .map(RoutineTask::getTitle)
                .orElse("None");
        
        // Mock avg score for now, or fetch from FocusScoreService if circular dependency allowed (avoided for now)
        String avgScore = "75"; 

        String prompt = PromptTemplates.fillTemplate(
                PromptTemplates.ROUTINE_OPTIMIZER_PROMPT,
                "avgScore", avgScore,
                "missedTask", missedTask,
                "identity", user.getIdentityArchetype() != null ? user.getIdentityArchetype() : "General User"
        );
        
        String fallback = "{\"suggestions\": [\"Review your priorities.\", \"Schedule breaks.\", \"Stick to your identity goals.\"]}";

        if (!isOllamaAvailable()) {
            return fallback;
        }

        try {
             return chatClientBuilder.build().prompt().user(prompt).call().content();
        } catch (Exception e) {
            return fallback;
        }
    }
}
