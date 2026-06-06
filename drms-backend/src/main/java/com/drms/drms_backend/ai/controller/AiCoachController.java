package com.drms.drms_backend.ai.controller;

import com.drms.drms_backend.ai.dto.response.*;
import com.drms.drms_backend.ai.service.AiCoachService;
import com.drms.drms_backend.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@lombok.RequiredArgsConstructor
public class AiCoachController {

    private final AiCoachService aiCoachService;

    // 1. ROUTINE COACH
    @GetMapping("/routine/coach")
    public ResponseEntity<RoutineCoachResponse> getRoutineCoaching(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(aiCoachService.getRoutineCoaching(user));
    }

    // 4. BURNOUT PREDICTOR
    @GetMapping("/burnout/status")
    public ResponseEntity<BurnoutResponse> getBurnoutStatus(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(aiCoachService.predictBurnout(user));
    }

    // 6. LIFE BALANCE
    @GetMapping("/life-balance")
    public ResponseEntity<LifeBalanceResponse> getLifeBalance(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(aiCoachService.analyzeLifeBalance(user));
    }

    // 9. DAILY REFLECTION
    @GetMapping("/reflection/question")
    public ResponseEntity<ReflectionResponse> getReflectionQuestion(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(aiCoachService.generateReflectionQuestion(user));
    }

    // 10. MINIMALIST MODE
    @GetMapping("/minimalist/state")
    public ResponseEntity<MinimalistStateResponse> getMinimalistState(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(aiCoachService.getMinimalistState(user));
    }
}
