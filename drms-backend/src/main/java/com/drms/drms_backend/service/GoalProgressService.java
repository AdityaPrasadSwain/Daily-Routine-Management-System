package com.drms.drms_backend.service;

import com.drms.drms_backend.dto.GoalProgressDTO;
import com.drms.drms_backend.dto.TaskDTO;
import com.drms.drms_backend.entity.RoutineTask;
import com.drms.drms_backend.repository.RoutineTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GoalProgressService {

    @Autowired
    private RoutineTaskRepository taskRepository;

    // @Autowired
    // private RoutineTaskService taskService; // To reuse DTO mapping

    public GoalProgressDTO calculateProgress(UUID goalId) {
        List<RoutineTask> tasks = taskRepository.findByGoalId(goalId);

        int totalTasks = tasks.size();
        int completedTasks = (int) tasks.stream()
                .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()))
                .count();

        int progressPercentage = totalTasks == 0 ? 0 : (int) Math.round(((double) completedTasks / totalTasks) * 100);

        String status = determineStatus(progressPercentage, totalTasks);

        GoalProgressDTO dto = new GoalProgressDTO();
        dto.setGoalId(goalId);
        dto.setProgressPercentage(progressPercentage);
        dto.setCompletedTasks(completedTasks);
        dto.setTotalTasks(totalTasks);
        dto.setStatus(status);

        // Convert tasks to DTOs for the breakdown view
        List<TaskDTO> taskDTOs = tasks.stream()
                .map(this::mapToTaskDTO)
                .collect(Collectors.toList());
        dto.setTasks(taskDTOs);

        return dto;
    }

    private String determineStatus(int percentage, int totalTasks) {
        if (totalTasks == 0)
            return "NOT_STARTED";
        if (percentage == 0)
            return "NOT_STARTED";
        if (percentage >= 100)
            return "COMPLETED";
        if (percentage >= 80)
            return "NEAR_COMPLETION";
        return "IN_PROGRESS";
    }

    // Helper map function since RoutineTaskService might not expose a direct
    // entity->dto mapper publically
    // Or strictly we could wire in ModelMapper, but manual mapping is safe here.
    private TaskDTO mapToTaskDTO(RoutineTask task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setDueDate(task.getDueDate());
        dto.setGoalId(task.getGoal() != null ? task.getGoal().getId() : null);
        return dto;
    }
}
