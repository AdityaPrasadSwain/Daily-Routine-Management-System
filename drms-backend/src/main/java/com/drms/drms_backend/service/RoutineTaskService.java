package com.drms.drms_backend.service;

import com.drms.drms_backend.dto.TaskDTO;
import com.drms.drms_backend.entity.RoutineTask;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.exception.ResourceNotFoundException;
import com.drms.drms_backend.repository.RoutineTaskRepository;
import com.drms.drms_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoutineTaskService {

    @Autowired
    private RoutineTaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public List<TaskDTO> getAllTasks(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return taskRepository.findByUserId(user.getId()).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<TaskDTO> getTasksForToday(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return taskRepository.findByUserIdAndDueDate(user.getId(), java.time.LocalDate.now())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TaskDTO createTask(String email, TaskDTO taskDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        RoutineTask task = new RoutineTask();
        task.setUser(user);
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setPriority(taskDTO.getPriority());
        task.setStatus(taskDTO.getStatus() != null ? taskDTO.getStatus() : "PENDING");
        task.setCategory(taskDTO.getCategory());
        task.setDueDate(taskDTO.getDueDate());
        task.setStartTime(taskDTO.getStartTime());
        task.setDurationMinutes(taskDTO.getDurationMinutes());

        RoutineTask savedTask = taskRepository.save(task);
        return mapToDTO(savedTask);
    }

    public TaskDTO updateTask(UUID id, TaskDTO taskDTO) {
        RoutineTask task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (taskDTO.getTitle() != null)
            task.setTitle(taskDTO.getTitle());
        if (taskDTO.getDescription() != null)
            task.setDescription(taskDTO.getDescription());
        if (taskDTO.getStatus() != null)
            task.setStatus(taskDTO.getStatus());
        if (taskDTO.getPriority() != null)
            task.setPriority(taskDTO.getPriority());
        if (taskDTO.getDueDate() != null)
            task.setDueDate(taskDTO.getDueDate());
        if (taskDTO.getStartTime() != null)
            task.setStartTime(taskDTO.getStartTime());
        if (taskDTO.getDurationMinutes() != null)
            task.setDurationMinutes(taskDTO.getDurationMinutes());
        if (taskDTO.getTotalFocusTimeSeconds() != null)
            task.setTotalFocusTimeSeconds(taskDTO.getTotalFocusTimeSeconds());

        RoutineTask savedTask = taskRepository.save(task);
        return mapToDTO(savedTask);
    }

    public void deleteTask(UUID id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found");
        }
        taskRepository.deleteById(id);
    }

    public Map<String, Object> getUpcomingTasks(String email, String startDateStr) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LocalDate startDate;
        if (startDateStr != null && !startDateStr.isEmpty()) {
            startDate = LocalDate.parse(startDateStr);
        } else {
            startDate = LocalDate.now();
        }

        LocalDate endDate = startDate.plusDays(6); // Next 7 days including start date

        // Get all tasks for the user
        List<RoutineTask> allTasks = taskRepository.findByUserId(user.getId());

        // Group tasks by date
        List<Map<String, Object>> dailyGroups = new ArrayList<>();

        for (int i = 0; i < 7; i++) {
            LocalDate currentDate = startDate.plusDays(i);

            // Filter tasks for this specific date
            List<TaskDTO> tasksForDate = allTasks.stream()
                    .filter(task -> task.getDueDate() != null && task.getDueDate().equals(currentDate))
                    .map(this::mapToDTO)
                    .sorted((t1, t2) -> {
                        String time1 = t1.getStartTime() != null ? t1.getStartTime().toString() : "23:59";
                        String time2 = t2.getStartTime() != null ? t2.getStartTime().toString() : "23:59";
                        return time1.compareTo(time2);
                    })
                    .collect(Collectors.toList());

            Map<String, Object> dayGroup = new HashMap<>();
            dayGroup.put("date", currentDate.toString());
            dayGroup.put("tasks", tasksForDate);

            dailyGroups.add(dayGroup);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("dailyGroups", dailyGroups);
        response.put("startDate", startDate.toString());
        response.put("endDate", endDate.toString());

        return response;
    }

    public Map<String, Object> getNext7DaysRoutine(String email) {
        return getUpcomingTasks(email, null);
    }

    private TaskDTO mapToDTO(RoutineTask task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setCategory(task.getCategory());
        dto.setDueDate(task.getDueDate());
        dto.setStartTime(task.getStartTime());
        dto.setDurationMinutes(task.getDurationMinutes());
        dto.setTotalFocusTimeSeconds(task.getTotalFocusTimeSeconds());
        dto.setProgress(task.getProgress());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }

    public TaskDTO updateTaskProgress(UUID id, Integer progress) {
        RoutineTask task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        task.setProgress(progress);
        if (progress == 100) {
            task.setStatus("COMPLETED");
        } else if (progress > 0 && "TODO".equals(task.getStatus()) || "PENDING".equals(task.getStatus())) {
            task.setStatus("IN_PROGRESS");
        }
        return mapToDTO(taskRepository.save(task));
    }
}
