package com.drms.drms_backend.controller;

import com.drms.drms_backend.dto.TaskDTO;
import com.drms.drms_backend.service.RoutineTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class RoutineTaskController {

    @Autowired
    private RoutineTaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.drms.drms_backend.entity.User user) {
        return ResponseEntity.ok(taskService.getAllTasks(user.getEmail()));
    }

    @GetMapping("/today")
    public ResponseEntity<List<TaskDTO>> getTasksForToday(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.drms.drms_backend.entity.User user) {
        return ResponseEntity.ok(taskService.getTasksForToday(user.getEmail()));
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.drms.drms_backend.entity.User user) {
        return ResponseEntity.ok(taskService.createTask(user.getEmail(), taskDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable UUID id, @RequestBody TaskDTO taskDTO) {
        return ResponseEntity.ok(taskService.updateTask(id, taskDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/history")
    public ResponseEntity<List<TaskDTO>> getHistory(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.drms.drms_backend.entity.User user) {
        return getAllTasks(user);
    }

    @PostMapping("/{id}/reschedule")
    public ResponseEntity<TaskDTO> rescheduleTask(@PathVariable UUID id, @RequestBody TaskDTO taskDTO) {
        return updateTask(id, taskDTO);
    }

    @PatchMapping("/{id}/focus")
    public ResponseEntity<TaskDTO> updateFocusTime(@PathVariable UUID id) {
        TaskDTO dto = new TaskDTO();
        return updateTask(id, dto);
    }

    @PatchMapping("/{id}/progress")
    public ResponseEntity<TaskDTO> updateTaskProgress(@PathVariable UUID id, @RequestParam Integer progress) {
        return ResponseEntity.ok(taskService.updateTaskProgress(id, progress));
    }

    @GetMapping("/routine/next-7-days")
    public ResponseEntity<?> getNext7Days(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.drms.drms_backend.entity.User user) {
        return ResponseEntity.ok(taskService.getNext7DaysRoutine(user.getEmail()));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<?> getUpcomingTasks(
            @RequestParam(required = false) String startDate,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.drms.drms_backend.entity.User user) {
        return ResponseEntity.ok(taskService.getUpcomingTasks(user.getEmail(), startDate));
    }

    // --- Alarm Endpoints ---

    @Autowired
    private com.drms.drms_backend.service.TaskAlarmService alarmService;

    @GetMapping("/{taskId}/alarms")
    public ResponseEntity<List<com.drms.drms_backend.dto.TaskAlarmDTO>> getAlarms(@PathVariable UUID taskId) {
        return ResponseEntity.ok(alarmService.getAlarmsByTaskId(taskId));
    }

    @PostMapping(value = "/{taskId}/alarms", consumes = {
            org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<com.drms.drms_backend.dto.TaskAlarmDTO> createAlarm(
            @PathVariable UUID taskId,
            @RequestPart("alarm") String alarmJson,
            @RequestPart(value = "file", required = false) org.springframework.web.multipart.MultipartFile file)
            throws java.io.IOException {

        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        com.drms.drms_backend.dto.TaskAlarmDTO alarmDTO = mapper.readValue(alarmJson,
                com.drms.drms_backend.dto.TaskAlarmDTO.class);

        return ResponseEntity.ok(alarmService.createAlarm(taskId, alarmDTO, file));
    }

    @DeleteMapping("/alarms/{alarmId}")
    public ResponseEntity<Void> deleteAlarm(@PathVariable UUID alarmId) {
        alarmService.deleteAlarm(alarmId);
        return ResponseEntity.noContent().build();
    }
}
