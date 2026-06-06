package com.drms.drms_backend.repository;

import com.drms.drms_backend.entity.TaskAlarm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskAlarmRepository extends JpaRepository<TaskAlarm, UUID> {
    List<TaskAlarm> findByTaskId(UUID taskId);

    // Derived query to find alarms by the User who owns the Routine that owns the
    // Task
    List<TaskAlarm> findByTask_Routine_User_Id(UUID userId);

    long countByTask_UserAndIsActiveTrue(com.drms.drms_backend.entity.User user);
}
