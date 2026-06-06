package com.drms.drms_backend.ai.controller;

import com.drms.drms_backend.ai.dto.request.AlarmMessageRequest;
import com.drms.drms_backend.ai.dto.response.AlarmMessageResponse;
import com.drms.drms_backend.ai.service.AiAlarmService;
import com.drms.drms_backend.entity.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for AI Alarm Message features
 */
@RestController
@RequestMapping("/api/ai/alarms")
@lombok.RequiredArgsConstructor
public class AiAlarmController {

    private final AiAlarmService aiAlarmService;

    /**
     * POST /api/ai/alarms/message
     * Generate AI-powered motivational alarm message
     * 
     * @param user    Authenticated user (injected by Spring Security)
     * @param request Alarm message request
     * @return AI-generated alarm message
     */
    @PostMapping("/message")
    public ResponseEntity<AlarmMessageResponse> generateAlarmMessage(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AlarmMessageRequest request) {

        AlarmMessageResponse response = aiAlarmService.generateAlarmMessage(request, user);
        return ResponseEntity.ok(response);
    }

    // 8. SMART SILENCE
    @PostMapping("/intelligence")
    public ResponseEntity<com.drms.drms_backend.ai.dto.response.SmartSilenceResponse> getSmartAlarmIntelligence(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(aiAlarmService.getSmartAlarmIntelligence(user));
    }
}
