package com.drms.drms_backend.service;

import com.drms.drms_backend.dto.TaskAlarmDTO;
import com.drms.drms_backend.entity.RoutineTask;
import com.drms.drms_backend.entity.TaskAlarm;
import com.drms.drms_backend.exception.ResourceNotFoundException;
import com.drms.drms_backend.repository.RoutineTaskRepository;
import com.drms.drms_backend.repository.TaskAlarmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskAlarmService {

    @Autowired
    private TaskAlarmRepository alarmRepository;

    @Autowired
    private RoutineTaskRepository taskRepository;

    private static final String UPLOAD_DIR = "uploads/alarms/";

    public List<TaskAlarmDTO> getAlarmsByTaskId(UUID taskId) {
        return alarmRepository.findByTaskId(taskId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<TaskAlarmDTO> getAllAlarmsForUser(com.drms.drms_backend.entity.User user) {
        return alarmRepository.findByTask_Routine_User_Id(user.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TaskAlarmDTO createAlarm(UUID taskId, TaskAlarmDTO alarmDTO, MultipartFile file) throws IOException {
        RoutineTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        TaskAlarm alarm = new TaskAlarm();
        alarm.setTask(task);
        alarm.setRemindBeforeMinutes(alarmDTO.getRemindBeforeMinutes());
        alarm.setVoiceType(alarmDTO.getVoiceType());
        alarm.setVoiceText(alarmDTO.getVoiceText());
        // Set alarm sound with default fallback for backward compatibility
        alarm.setAlarmSound(alarmDTO.getAlarmSound() != null ? alarmDTO.getAlarmSound() : "default");

        // Calculate alarm time
        if (task.getDueDate() != null && alarmDTO.getRemindBeforeMinutes() != null) {
            // Use startTime if available, otherwise default to 9 AM
            java.time.LocalTime time = task.getStartTime() != null ? task.getStartTime() : java.time.LocalTime.of(9, 0);
            LocalDateTime taskDateTime = LocalDateTime.of(task.getDueDate(), time);
            alarm.setAlarmTime(taskDateTime.minusMinutes(alarmDTO.getRemindBeforeMinutes()));
        } else {
            // Fallback: 1 hour from now
            alarm.setAlarmTime(LocalDateTime.now().plusHours(1));
        }

        if (file != null && !file.isEmpty()) {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), uploadPath.resolve(filename));
            alarm.setSoundFile(filename);
        }

        TaskAlarm savedAlarm = alarmRepository.save(alarm);
        return mapToDTO(savedAlarm);
    }

    public void deleteAlarm(UUID alarmId) {
        if (!alarmRepository.existsById(alarmId)) {
            throw new ResourceNotFoundException("Alarm not found");
        }
        alarmRepository.deleteById(alarmId);
    }

    private TaskAlarmDTO mapToDTO(TaskAlarm alarm) {
        TaskAlarmDTO dto = new TaskAlarmDTO();
        dto.setId(alarm.getId());
        dto.setTaskId(alarm.getTask().getId());
        dto.setAlarmTime(alarm.getAlarmTime());
        dto.setRemindBeforeMinutes(alarm.getRemindBeforeMinutes());
        dto.setVoiceType(alarm.getVoiceType());
        dto.setVoiceText(alarm.getVoiceText());
        dto.setSoundFile(alarm.getSoundFile());
        // Set alarm sound with default fallback for backward compatibility
        dto.setAlarmSound(alarm.getAlarmSound() != null ? alarm.getAlarmSound() : "default");
        dto.setIsActive(alarm.getIsActive());
        return dto;
    }
}
