package com.drms.drms_backend.socialmedia.controller;

import com.drms.drms_backend.socialmedia.dto.SocialAiInsightResponse;
import com.drms.drms_backend.socialmedia.dto.SocialMediaLogRequest;
import com.drms.drms_backend.socialmedia.dto.SocialMediaStatusResponse;
import com.drms.drms_backend.socialmedia.entity.SocialMediaBudget;
import com.drms.drms_backend.socialmedia.entity.SocialMediaLog;
import com.drms.drms_backend.socialmedia.service.SocialMediaService;
import com.drms.drms_backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
public class SocialMediaController {

    private final SocialMediaService socialMediaService;

    @PostMapping("/awareness/log")
    public ResponseEntity<SocialMediaLog> logUsage(
            @AuthenticationPrincipal User user,
            @RequestBody SocialMediaLogRequest request) {
        return ResponseEntity.ok(socialMediaService.logUsage(user, request));
    }

    @GetMapping("/budget/status")
    public ResponseEntity<SocialMediaStatusResponse> getStatus(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(socialMediaService.getStatus(user));
    }

    @PostMapping("/budget/set")
    public ResponseEntity<SocialMediaBudget> setLimit(
            @AuthenticationPrincipal User user,
            @RequestParam int minutes) {
        return ResponseEntity.ok(socialMediaService.setLimit(user, minutes));
    }

    @PostMapping("/mode/set")
    public ResponseEntity<SocialMediaBudget> setControlMode(
            @AuthenticationPrincipal User user,
            @RequestParam com.drms.drms_backend.socialmedia.entity.ControlMode mode) {
        return ResponseEntity.ok(socialMediaService.setControlMode(user, mode));
    }

    @GetMapping("/replacement/task")
    public ResponseEntity<SocialAiInsightResponse> getReplacementTask(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String trigger) {
        return ResponseEntity.ok(socialMediaService.getReplacementTask(user, trigger));
    }

    @PostMapping("/trigger/analyze")
    public ResponseEntity<SocialAiInsightResponse> analyzeTrigger(
            @AuthenticationPrincipal User user,
            @RequestParam String trigger) {
        return ResponseEntity.ok(socialMediaService.analyzeTrigger(user, trigger));
    }
}
