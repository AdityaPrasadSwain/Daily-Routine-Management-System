package com.drms.drms_backend.controller;

import com.drms.drms_backend.entity.GrowthStats;
import com.drms.drms_backend.service.GrowthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.drms.drms_backend.entity.User;
import java.util.Map;

@RestController
@RequestMapping("/api/growth")
public class GrowthController {

    @Autowired
    private GrowthService growthService;

    @GetMapping("/stats")
    public ResponseEntity<GrowthStats> getStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(growthService.getStats(user.getEmail()));
    }

    @PostMapping("/log-avoidance")
    public ResponseEntity<GrowthStats> logAvoidance(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Integer> request) {

        Integer minutes = request.get("minutes");
        if (minutes == null || minutes <= 0) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(growthService.logAvoidance(user.getEmail(), minutes));
    }
}
