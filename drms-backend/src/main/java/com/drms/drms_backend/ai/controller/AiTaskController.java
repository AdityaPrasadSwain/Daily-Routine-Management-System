package com.drms.drms_backend.ai.controller;

import com.drms.drms_backend.ai.dto.request.TaskBreakdownRequest;
import com.drms.drms_backend.ai.dto.response.TaskBreakdownResponse;
import com.drms.drms_backend.ai.service.AiTaskService;
import com.drms.drms_backend.entity.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for AI Task Breakdown features
 */
@RestController
@RequestMapping("/api/ai/tasks")
@lombok.RequiredArgsConstructor
public class AiTaskController {

    private final AiTaskService aiTaskService;

    /**
     * POST /api/ai/tasks/breakdown
     * Break down a goal into actionable tasks using AI
     * 
     * @param user    Authenticated user (injected by Spring Security)
     * @param request Task breakdown request
     * @return AI-generated task breakdown
     */
    @PostMapping("/generate")
    public ResponseEntity<TaskBreakdownResponse> breakdownGoal(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TaskBreakdownRequest request) {

        TaskBreakdownResponse response = aiTaskService.breakdownGoal(request, user);
        return ResponseEntity.ok(response);
    }

    // 2. TOP 3 TASKS
    @GetMapping("/top3")
    public ResponseEntity<com.drms.drms_backend.ai.dto.response.TopTasksResponse> getTop3Tasks(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(aiTaskService.getTop3Tasks(user));
    }

    // 3. ENERGY PLAN
    @PostMapping("/energy-plan")
    public ResponseEntity<com.drms.drms_backend.ai.dto.response.EnergyPlanResponse> generateEnergyPlan(
            @AuthenticationPrincipal User user,
            @RequestBody java.util.Map<String, String> body) {
        String energyLevel = body.getOrDefault("energyLevel", "MORNING_HIGH");
        return ResponseEntity.ok(aiTaskService.generateEnergyPlan(user, energyLevel));
    }
}
