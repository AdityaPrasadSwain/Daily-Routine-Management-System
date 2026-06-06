package com.drms.drms_backend.service;

import com.drms.drms_backend.entity.Goal;
import com.drms.drms_backend.entity.GoalReflection;
import com.drms.drms_backend.repository.GoalReflectionRepository; // Need to create this
import com.drms.drms_backend.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class GoalReflectionService {

    @Autowired
    private GoalReflectionRepository goalReflectionRepository;

    @Autowired
    private GoalRepository goalRepository;

    public GoalReflection addReflection(UUID goalId, GoalReflection reflection) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        reflection.setGoal(goal);
        return goalReflectionRepository.save(reflection);
    }

    public List<GoalReflection> getReflectionsByGoalId(UUID goalId) {
        return goalReflectionRepository.findByGoalIdOrderByReflectionDateDesc(goalId);
    }
}
