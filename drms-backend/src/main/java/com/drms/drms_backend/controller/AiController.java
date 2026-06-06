package com.drms.drms_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @GetMapping("/suggestions")
    public ResponseEntity<Map<String, Object>> getSuggestions(@RequestParam(required = false) String type) {
        // Mock AI suggestions
        return ResponseEntity.ok(Collections.singletonMap("suggestions", "Try to focus on one task at a time."));
    }

    @GetMapping("/insight")
    public ResponseEntity<Map<String, Object>> getInsights() {
        return ResponseEntity.ok(Collections.singletonMap("insight", "Your productivity peaked on Tuesday."));
    }
}
