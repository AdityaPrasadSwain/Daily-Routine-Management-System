package com.drms.drms_backend.service;

import com.drms.drms_backend.dto.GoalDTO;
import com.drms.drms_backend.entity.Goal;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.repository.GoalRepository;
import com.drms.drms_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    public GoalDTO createGoal(GoalDTO goalDTO, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Goal goal = new Goal();
        goal.setUser(user);
        goal.setTitle(goalDTO.getTitle());
        goal.setDescription(goalDTO.getDescription());
        goal.setType(goalDTO.getType());
        goal.setTargetDate(goalDTO.getTargetDate());
        goal.setStatus(goalDTO.getStatus() != null ? goalDTO.getStatus() : "IN_PROGRESS");
        goal.setCreatedAt(LocalDateTime.now());

        Goal savedGoal = goalRepository.save(goal);
        return mapToDTO(savedGoal);
    }

    public List<GoalDTO> getGoalsByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return goalRepository.findByUser(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public GoalDTO getGoalById(UUID id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        return mapToDTO(goal);
    }

    public GoalDTO updateGoal(UUID id, GoalDTO goalDTO) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        goal.setTitle(goalDTO.getTitle());
        goal.setDescription(goalDTO.getDescription());
        if (goalDTO.getType() != null)
            goal.setType(goalDTO.getType());
        if (goalDTO.getTargetDate() != null)
            goal.setTargetDate(goalDTO.getTargetDate());
        if (goalDTO.getStatus() != null)
            goal.setStatus(goalDTO.getStatus());

        Goal updatedGoal = goalRepository.save(goal);
        return mapToDTO(updatedGoal);
    }

    public void deleteGoal(UUID id) {
        goalRepository.deleteById(id);
    }

    public GoalDTO updateGoalProgress(UUID id, Integer progress) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        goal.setProgress(progress);
        if (progress == 100) {
            goal.setStatus("COMPLETED");
        } else if (progress > 0 && "COMPLETED".equals(goal.getStatus())) {
            goal.setStatus("IN_PROGRESS");
        }
        Goal updatedGoal = goalRepository.save(goal);
        return mapToDTO(updatedGoal);
    }

    private GoalDTO mapToDTO(Goal goal) {
        GoalDTO dto = new GoalDTO();
        dto.setId(goal.getId());
        dto.setUserId(goal.getUser().getId());
        dto.setTitle(goal.getTitle());
        dto.setDescription(goal.getDescription());
        dto.setType(goal.getType());
        dto.setTargetDate(goal.getTargetDate());
        dto.setStatus(goal.getStatus());
        dto.setProgress(goal.getProgress());
        return dto;
    }
}
