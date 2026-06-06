package com.drms.drms_backend.ai.controller;

import com.drms.drms_backend.ai.dto.response.FocusScoreResponse;
import com.drms.drms_backend.ai.service.FocusScoreService;
import com.drms.drms_backend.ai.service.MentalLoadService;
import com.drms.drms_backend.ai.service.RoutineOptimizerService;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/productivity")
@RequiredArgsConstructor
public class AiProductivityController {

    private final FocusScoreService focusScoreService;
    private final MentalLoadService mentalLoadService;
    private final RoutineOptimizerService routineOptimizerService;
    private final UserRepository userRepository;

    @GetMapping("/health")
    public String health() {
        return "AI Productivity module running safely";
    }

    @GetMapping("/focus-score")
    public ResponseEntity<FocusScoreResponse> getFocusScore(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(focusScoreService.calculateDailyScore(user));
    }

    @GetMapping("/mental-load")
    public ResponseEntity<String> getMentalLoad(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(mentalLoadService.analyzeMentalLoad(user));
    }

    @PostMapping("/routine/optimize")
    public ResponseEntity<String> optimizeRoutine(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(routineOptimizerService.optimizeRoutine(user));
    }

    @PostMapping("/identity")
    public ResponseEntity<User> setIdentity(@AuthenticationPrincipal User user, @RequestParam String archetype) {
        user.setIdentityArchetype(archetype);
        return ResponseEntity.ok(userRepository.save(user));
    }
}
