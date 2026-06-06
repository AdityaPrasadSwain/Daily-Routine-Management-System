package com.drms.drms_backend.ai.service;

import com.drms.drms_backend.ai.dto.request.TaskBreakdownRequest;
import com.drms.drms_backend.ai.dto.response.TaskBreakdownResponse;
import com.drms.drms_backend.ai.dto.response.TaskBreakdownResponse.TaskSuggestion;
import com.drms.drms_backend.ai.prompt.PromptTemplates;
import com.drms.drms_backend.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * Service for AI-powered task breakdown
 */
@Service
public class AiTaskService extends BaseAiService {

        private static final Logger logger = LoggerFactory.getLogger(AiTaskService.class);

        /**
         * Break down a goal into actionable tasks using AI
         * 
         * @param request Task breakdown request with goal and deadline
         * @param user    Authenticated user
         * @return AI-generated task breakdown or fallback
         */
        @Autowired
        private com.drms.drms_backend.repository.RoutineTaskRepository taskRepository;

        /**
         * Break down a goal into actionable tasks using AI
         */
        public TaskBreakdownResponse breakdownGoal(TaskBreakdownRequest request, User user) {
                logger.info("Breaking down goal for user: {} - Goal: {}",
                                user.getEmail(), request.getGoalTitle());

                // Check if Ollama is available
                if (!isOllamaAvailable()) {
                        logger.warn("Ollama not available, returning fallback response");
                        return createFallbackResponse(request);
                }

                // Build prompt from template
                String prompt = PromptTemplates.fillTemplate(
                                PromptTemplates.TASK_BREAKDOWN_PROMPT,
                                "goalTitle", request.getGoalTitle(),
                                "deadline", request.getTargetDate().toString());

                // Call AI with fallback
                TaskBreakdownResponse fallback = createFallbackResponse(request);
                TaskBreakdownResponse response = callAi(prompt, TaskBreakdownResponse.class, fallback);

                logger.info("Task breakdown generated successfully with {} tasks",
                                response.getTasks().size());
                return response;
        }

        public String estimateDifficulty(String taskDescription) {
                try {
                        String prompt = String.format("""
                                        Estimate the difficulty of this task: "%s".
                                        Return ONLY JSON:
                                        {
                                          "difficulty": "EASY" | "MEDIUM" | "HARD",
                                          "estimatedMinutes": 30,
                                          "storyPoints": 1 | 2 | 3 | 5 | 8
                                        }
                                        """, taskDescription);

                        return chatClientBuilder.build().prompt().user(prompt).call().content();
                } catch (Exception e) {
                        return "{\"difficulty\": \"UNKNOWN\", \"estimatedMinutes\": 0}";
                }
        }

        // 2. TOP 3 TASKS
        public com.drms.drms_backend.ai.dto.response.TopTasksResponse getTop3Tasks(User user) {
                List<com.drms.drms_backend.entity.RoutineTask> tasks = taskRepository.findByUserAndDueDate(user,
                                java.time.LocalDate.now());

                if (tasks.isEmpty() || !isOllamaAvailable()) {
                        // Fallback: just take first 3
                        return new com.drms.drms_backend.ai.dto.response.TopTasksResponse(
                                        tasks.stream().limit(3).map(
                                                        t -> new com.drms.drms_backend.ai.dto.response.TopTasksResponse.TopTask(
                                                                        t.getId().toString(), "High priority default"))
                                                        .toList());
                }

                String tasksList = tasks.stream()
                                .map(t -> t.getId() + ": " + t.getTitle() + " (" + t.getPriority() + ")")
                                .reduce("", (a, b) -> a + "\n" + b);

                String prompt = PromptTemplates.fillTemplate(
                                PromptTemplates.TOP_3_TASKS_PROMPT,
                                "tasksList", tasksList);

                return callAi(prompt, com.drms.drms_backend.ai.dto.response.TopTasksResponse.class,
                                new com.drms.drms_backend.ai.dto.response.TopTasksResponse());
        }

        // 3. ENERGY PLAN
        public com.drms.drms_backend.ai.dto.response.EnergyPlanResponse generateEnergyPlan(User user,
                        String energyLevel) {
                List<com.drms.drms_backend.entity.RoutineTask> tasks = taskRepository.findByUserAndDueDate(user,
                                java.time.LocalDate.now());

                if (tasks.isEmpty() || !isOllamaAvailable()) {
                        return new com.drms.drms_backend.ai.dto.response.EnergyPlanResponse(List.of());
                }

                String tasksList = tasks.stream().map(t -> t.getId() + ": " + t.getTitle()).reduce("",
                                (a, b) -> a + "\n" + b);

                String prompt = PromptTemplates.fillTemplate(
                                PromptTemplates.ENERGY_PLAN_PROMPT,
                                "energyLevel", energyLevel,
                                "tasksList", tasksList);

                return callAi(prompt, com.drms.drms_backend.ai.dto.response.EnergyPlanResponse.class,
                                new com.drms.drms_backend.ai.dto.response.EnergyPlanResponse());
        }

        /**
         * Create fallback response when AI is unavailable
         */
        private TaskBreakdownResponse createFallbackResponse(TaskBreakdownRequest request) {
                List<TaskSuggestion> tasks = Arrays.asList(
                                new TaskSuggestion("Research and plan: " + request.getGoalTitle(), "HIGH", 30),
                                new TaskSuggestion("Break down into smaller milestones", "HIGH", 20),
                                new TaskSuggestion("Identify required resources", "MEDIUM", 15),
                                new TaskSuggestion("Create detailed action plan", "MEDIUM", 25),
                                new TaskSuggestion("Set up tracking system", "LOW", 10));

                return new TaskBreakdownResponse(tasks);
        }
}
