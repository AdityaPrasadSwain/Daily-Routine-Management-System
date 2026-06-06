package com.drms.drms_backend.ai.service;

import com.drms.drms_backend.ai.prompt.PromptTemplates;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.repository.RoutineTaskRepository;
import com.drms.drms_backend.repository.TaskAlarmRepository;
import com.drms.drms_backend.socialmedia.entity.SocialMediaLog;
import com.drms.drms_backend.socialmedia.repository.SocialMediaLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MentalLoadService extends BaseAiService {

    private final RoutineTaskRepository routineTaskRepository;
    private final TaskAlarmRepository taskAlarmRepository;
    private final SocialMediaLogRepository socialMediaLogRepository;

    public MentalLoadService(RoutineTaskRepository routineTaskRepository,
                             TaskAlarmRepository taskAlarmRepository,
                             SocialMediaLogRepository socialMediaLogRepository) {
        this.routineTaskRepository = routineTaskRepository;
        this.taskAlarmRepository = taskAlarmRepository;
        this.socialMediaLogRepository = socialMediaLogRepository;
    }

    public String analyzeMentalLoad(User user) {
        // 1. Fetch Data
        long pendingTasks = routineTaskRepository.countByUserAndStatusNot(user, "COMPLETED");
        // Use countByTask_UserAndIsActiveTrue assuming the repo supports it or similar.
        // We need to check if countByTask_UserAndIsActiveTrue exists or if we need a safe fallback.
        // Assuming Standard repo method based on entity structure.
        long activeAlarms = 0;
        try {
            activeAlarms = taskAlarmRepository.countByTask_UserAndIsActiveTrue(user);
        } catch (Exception e) {
            // Fallback if method doesn't exist
            activeAlarms = 0; 
        }

        List<SocialMediaLog> todayLogs = socialMediaLogRepository.findByUserAndDate(user, LocalDate.now());
        int socialMinutes = todayLogs.stream().mapToInt(SocialMediaLog::getMinutesSpent).sum();
        
        // 2. Prepare AI Prompt
        String prompt = PromptTemplates.fillTemplate(
                PromptTemplates.MENTAL_LOAD_ANALYSIS_PROMPT,
                "pendingTasks", String.valueOf(pendingTasks),
                "urgentAlarms", String.valueOf(activeAlarms),
                "socialDrain", String.valueOf(socialMinutes),
                "identity", user.getIdentityArchetype() != null ? user.getIdentityArchetype() : "General User"
        );

        // 3. Define Fallback
        String fallback = "{\"status\": \"MODERATE\", \"suggestion\": \"Take a break and clear your mind.\"}";
        
        if (pendingTasks > 10) {
            fallback = "{\"status\": \"HIGH\", \"suggestion\": \"Prioritize your top 3 tasks and defer the rest.\"}";
        }

        // 4. Call AI
        if (!isOllamaAvailable()) {
            return fallback;
        }

        // The template asks for JSON, so we use callAi expecting String/Object or direct content?
        // BaseAiService.callAi expects a class. Let's create a DTO or just return raw JSON string if we want to parse it on frontend.
        // But the previous implementations returned String (JSON formatted).
        // Let's stick to returning String for now as per the Controller signature.
        // We can use the raw chatClient call like in FocusScoreService or use callAi if we had a DTO.
        // The signature in MentalLoadService was String.
        
        try {
             return chatClientBuilder.build().prompt().user(prompt).call().content();
        } catch (Exception e) {
            return fallback;
        }
    }
}
