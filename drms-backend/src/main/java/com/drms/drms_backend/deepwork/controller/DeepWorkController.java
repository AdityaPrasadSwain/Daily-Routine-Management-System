package com.drms.drms_backend.deepwork.controller;

import com.drms.drms_backend.deepwork.entity.DeepWorkSession;
import com.drms.drms_backend.deepwork.service.DeepWorkService;
import com.drms.drms_backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/ai/deep-work")
@RequiredArgsConstructor
public class DeepWorkController {

    private final DeepWorkService deepWorkService;

    @PostMapping("/start")
    public ResponseEntity<DeepWorkSession> startSession(
            @AuthenticationPrincipal User user,
            @RequestParam int minutes) {
        return ResponseEntity.ok(deepWorkService.startSession(user, minutes));
    }

    @PostMapping("/stop")
    public ResponseEntity<DeepWorkSession> stopSession(
            @AuthenticationPrincipal User user,
            @RequestParam UUID sessionId,
            @RequestParam int distractions,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(deepWorkService.stopSession(sessionId, distractions, notes));
    }
}
