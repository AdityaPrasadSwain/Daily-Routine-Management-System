package com.drms.drms_backend.controller;

import com.drms.drms_backend.entity.GoalReflection;
import com.drms.drms_backend.service.GoalIntelligenceService;
import com.drms.drms_backend.service.GoalReflectionService; // Need to create this
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/goals")
public class GoalInsightController {

    @Autowired
    private GoalIntelligenceService goalIntelligenceService;

    @Autowired
    private GoalReflectionService goalReflectionService;

    @GetMapping("/{id}/health")
    public ResponseEntity<Map<String, Integer>> getGoalHealth(@PathVariable UUID id) {
        int score = goalIntelligenceService.calculateHealthScore(id);
        return ResponseEntity.ok(Map.of("score", score));
    }

    @GetMapping("/{id}/momentum")
    public ResponseEntity<Map<String, String>> getGoalMomentum(@PathVariable UUID id) {
        String momentum = goalIntelligenceService.calculateMomentum(id);
        return ResponseEntity.ok(Map.of("momentum", momentum));
    }

    @GetMapping("/{id}/insights")
    public ResponseEntity<List<String>> getGoalInsights(@PathVariable UUID id) {
        return ResponseEntity.ok(goalIntelligenceService.generateInsights(id));
    }

    @PostMapping("/{id}/reflections")
    public ResponseEntity<?> addReflection(@PathVariable UUID id, @RequestBody GoalReflection reflection) {
        return ResponseEntity.ok(goalReflectionService.addReflection(id, reflection));
    }

    @GetMapping("/{id}/reflections")
    public ResponseEntity<List<GoalReflection>> getReflections(@PathVariable UUID id) {
        return ResponseEntity.ok(goalReflectionService.getReflectionsByGoalId(id));
    }
}
