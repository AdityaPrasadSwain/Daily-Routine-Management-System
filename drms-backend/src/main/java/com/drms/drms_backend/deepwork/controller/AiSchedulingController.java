package com.drms.drms_backend.deepwork.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai/scheduling")
public class AiSchedulingController {

    // ISOLATED CONTROLLER: No constructor, no service dependencies
    // This ensures ApplicationContext startup is not blocked by missing services

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("AI Scheduling module running safely");
    }
}
