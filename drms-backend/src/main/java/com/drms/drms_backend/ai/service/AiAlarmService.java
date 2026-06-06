package com.drms.drms_backend.ai.service;

import com.drms.drms_backend.ai.dto.request.AlarmMessageRequest;
import com.drms.drms_backend.ai.dto.response.AlarmMessageResponse;
import com.drms.drms_backend.ai.prompt.PromptTemplates;
import com.drms.drms_backend.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Service for AI-powered alarm message generation
 */
@Service
public class AiAlarmService extends BaseAiService {

    private static final Logger logger = LoggerFactory.getLogger(AiAlarmService.class);

    /**
     * Generate AI-powered motivational alarm message
     * 
     * @param request Alarm message request with task, time, and type
     * @param user    Authenticated user
     * @return AI-generated alarm message or fallback
     */
    public AlarmMessageResponse generateAlarmMessage(AlarmMessageRequest request, User user) {
        logger.info("Generating alarm message for user: {} - Task: {}",
                user.getEmail(), request.getTaskTitle());

        // Check if Ollama is available
        if (!isOllamaAvailable()) {
            logger.warn("Ollama not available, returning fallback response");
            return createFallbackResponse(request);
        }

        // Build prompt from template
        String prompt = PromptTemplates.fillTemplate(
                PromptTemplates.ALARM_MESSAGE_PROMPT,
                "taskTitle", request.getTaskTitle(),
                "time", request.getTime().toString(),
                "alarmType", request.getAlarmType());

        // Call AI with fallback
        AlarmMessageResponse fallback = createFallbackResponse(request);
        AlarmMessageResponse response = callAi(prompt, AlarmMessageResponse.class, fallback);

        logger.info("Alarm message generated successfully");
        return response;
    }

    @org.springframework.beans.factory.annotation.Autowired
    private com.drms.drms_backend.repository.TaskAlarmRepository alarmRepository;

    // 8. SMART SILENCE
    public com.drms.drms_backend.ai.dto.response.SmartSilenceResponse getSmartAlarmIntelligence(User user) {
        // Mock checking recent missed alarms
        int missedCount = 3;

        if (!isOllamaAvailable()) {
            return new com.drms.drms_backend.ai.dto.response.SmartSilenceResponse("Keep normal settings", false);
        }

        String prompt = PromptTemplates.fillTemplate(
                PromptTemplates.SMART_SILENCE_PROMPT,
                "missedCount", missedCount);

        return callAi(prompt, com.drms.drms_backend.ai.dto.response.SmartSilenceResponse.class,
                new com.drms.drms_backend.ai.dto.response.SmartSilenceResponse("Data unavailable", false));
    }

    /**
     * Create fallback response when AI is unavailable
     */
    private AlarmMessageResponse createFallbackResponse(AlarmMessageRequest request) {
        String message;
        String alarmType = request.getAlarmType().toUpperCase();
        String taskTitle = request.getTaskTitle();

        switch (alarmType) {
            case "MORNING":
                message = String.format("Good morning! Time to start: %s. You've got this!", taskTitle);
                break;
            case "AFTERNOON":
                message = String.format("Hey! Don't forget about: %s. Let's get it done!", taskTitle);
                break;
            case "EVENING":
                message = String.format("Evening reminder: %s. Quick and easy!", taskTitle);
                break;
            default:
                message = String.format("Time for: %s. Let's do this!", taskTitle);
        }

        return new AlarmMessageResponse(message);
    }
}
