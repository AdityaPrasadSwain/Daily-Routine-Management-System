package com.drms.drms_backend.repository;

import com.drms.drms_backend.entity.RoutineTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface RoutineTaskRepository extends JpaRepository<RoutineTask, UUID> {
        List<RoutineTask> findByUserId(UUID userId);

        List<RoutineTask> findByRoutineId(UUID routineId);

        // For calendar/history views
        List<RoutineTask> findByUserIdAndDueDate(UUID userId, LocalDate dueDate);

        // For AI daily review - find tasks by User entity and due date
        List<RoutineTask> findByUserAndDueDate(com.drms.drms_backend.entity.User user, LocalDate dueDate);

        @Query("SELECT t FROM RoutineTask t WHERE t.user.id = :userId AND t.dueDate BETWEEN :startDate AND :endDate")
        List<RoutineTask> findByUserIdAndDateRange(@Param("userId") UUID userId,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        List<RoutineTask> findByUserAndDueDateAfter(com.drms.drms_backend.entity.User user, LocalDate date);

        long countByUserAndStatusNot(com.drms.drms_backend.entity.User user, String status);

        long countByUserAndStatus(com.drms.drms_backend.entity.User user, String status);

        List<RoutineTask> findByGoalId(UUID goalId);

        List<RoutineTask> findByGoalIdAndCreatedAtAfter(UUID goalId, java.time.LocalDateTime createdAt);

        List<RoutineTask> findByGoalIdAndCreatedAtBetween(UUID goalId, java.time.LocalDateTime start,
                        java.time.LocalDateTime end);
}
