package com.drms.drms_backend.ai.service;

import com.drms.drms_backend.ai.dto.response.DailyReviewResponse;
import com.drms.drms_backend.ai.prompt.PromptTemplates;
import com.drms.drms_backend.entity.RoutineTask;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.repository.RoutineTaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for AI-powered daily review generation
 */
@Service
public class AiReviewService extends BaseAiService {

    private static final Logger logger = LoggerFactory.getLogger(AiReviewService.class);

    @Autowired
    private RoutineTaskRepository taskRepository;

    /**
     * Generate AI-powered daily review based on user's task completion
     * 
     * @param user Authenticated user
     * @return AI-generated daily review or fallback
     */
    public DailyReviewResponse generateDailyReview(User user) {
        logger.info("Generating daily review for user: {}", user.getEmail());

        // Fetch today's tasks for the user
        LocalDate today = LocalDate.now();
        List<RoutineTask> todaysTasks = taskRepository.findByUserAndDueDate(user, today);

        // Separate completed and missed tasks
        List<RoutineTask> completedTasks = todaysTasks.stream()
                .filter(task -> "COMPLETED".equalsIgnoreCase(task.getStatus()))
                .collect(Collectors.toList());

        List<RoutineTask> missedTasks = todaysTasks.stream()
                .filter(task -> "PENDING".equalsIgnoreCase(task.getStatus()) ||
                        "IN_PROGRESS".equalsIgnoreCase(task.getStatus()))
                .collect(Collectors.toList());

        int totalTasks = todaysTasks.size();

        logger.info("User {} - Total: {}, Completed: {}, Missed: {}",
                user.getEmail(), totalTasks, completedTasks.size(), missedTasks.size());

        // Check if Ollama is available
        if (!isOllamaAvailable()) {
            logger.warn("Ollama not available, returning fallback response");
            return createFallbackResponse(completedTasks.size(), missedTasks.size(), totalTasks);
        }

        // Build task summaries for prompt
        String completedTasksList = completedTasks.stream()
                .map(RoutineTask::getTitle)
                .collect(Collectors.joining(", "));

        String missedTasksList = missedTasks.stream()
                .map(RoutineTask::getTitle)
                .collect(Collectors.joining(", "));

        if (completedTasksList.isEmpty()) {
            completedTasksList = "None";
        }
        if (missedTasksList.isEmpty()) {
            missedTasksList = "None";
        }

        // Build prompt from template
        String prompt = PromptTemplates.fillTemplate(
                PromptTemplates.DAILY_REVIEW_PROMPT,
                "completedTasks", completedTasksList,
                "missedTasks", missedTasksList,
                "totalTasks", String.valueOf(totalTasks));

        // Call AI with fallback
        DailyReviewResponse fallback = createFallbackResponse(
                completedTasks.size(), missedTasks.size(), totalTasks);
        DailyReviewResponse response = callAi(prompt, DailyReviewResponse.class, fallback);

        logger.info("Daily review generated successfully");
        return response;
    }

    /**
     * Create fallback response when AI is unavailable
     */
    private DailyReviewResponse createFallbackResponse(int completed, int missed, int total) {
        int score = total > 0 ? (int) ((completed * 100.0) / total) : 0;

        String summary;
        if (completed == total && total > 0) {
            summary = "Perfect day! You completed all your tasks. Keep up the excellent work!";
        } else if (completed > missed) {
            summary = "Great job today! You completed most of your tasks. You're making solid progress.";
        } else if (completed > 0) {
            summary = "You made some progress today. Every completed task is a step forward. Keep going!";
        } else {
            summary = "Today was challenging, but tomorrow is a fresh start. Focus on one task at a time.";
        }

        return new DailyReviewResponse(
                summary,
                score,
                "Try prioritizing your most important tasks first thing in the morning when your energy is highest.");
    }
}
