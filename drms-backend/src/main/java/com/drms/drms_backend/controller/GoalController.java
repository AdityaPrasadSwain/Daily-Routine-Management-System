package com.drms.drms_backend.controller;

import com.drms.drms_backend.dto.GoalDTO;
import com.drms.drms_backend.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    @Autowired
    private GoalService goalService;

    @Autowired
    private com.drms.drms_backend.service.GoalProgressService goalProgressService;

    @GetMapping("/{id}/progress")
    public ResponseEntity<com.drms.drms_backend.dto.GoalProgressDTO> getGoalProgress(@PathVariable UUID id) {
        return ResponseEntity.ok(goalProgressService.calculateProgress(id));
    }

    @PostMapping
    public ResponseEntity<?> createGoal(@RequestBody GoalDTO goalDTO,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.drms.drms_backend.entity.User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            System.out.println("Received GoalDTO: " + goalDTO);
            return ResponseEntity.ok(goalService.createGoal(goalDTO, user.getEmail()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating goal: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<GoalDTO>> getUserGoals(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.drms.drms_backend.entity.User user) {
        return ResponseEntity.ok(goalService.getGoalsByUser(user.getEmail()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoalDTO> getGoalById(@PathVariable UUID id) {
        return ResponseEntity.ok(goalService.getGoalById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalDTO> updateGoal(@PathVariable UUID id, @RequestBody GoalDTO goalDTO) {
        return ResponseEntity.ok(goalService.updateGoal(id, goalDTO));
    }

    @PatchMapping("/{id}/progress")
    public ResponseEntity<GoalDTO> updateGoalProgress(@PathVariable UUID id, @RequestParam Integer progress) {
        return ResponseEntity.ok(goalService.updateGoalProgress(id, progress));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable UUID id) {
        goalService.deleteGoal(id);
        return ResponseEntity.noContent().build();
    }
}
