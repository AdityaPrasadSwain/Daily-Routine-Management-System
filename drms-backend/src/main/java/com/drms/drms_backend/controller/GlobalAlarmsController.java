package com.drms.drms_backend.controller;

import com.drms.drms_backend.dto.TaskAlarmDTO;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.service.TaskAlarmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/alarms")
public class GlobalAlarmsController {

    @Autowired
    private TaskAlarmService alarmService;

    @GetMapping
    public ResponseEntity<List<TaskAlarmDTO>> getAllAlarms(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(alarmService.getAllAlarmsForUser(user));
    }

    @GetMapping("/active")
    public ResponseEntity<List<TaskAlarmDTO>> getActiveAlarms(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(alarmService.getAllAlarmsForUser(user));
    }
}
