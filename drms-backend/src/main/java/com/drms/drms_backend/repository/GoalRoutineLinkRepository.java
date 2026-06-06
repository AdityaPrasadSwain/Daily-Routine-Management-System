package com.drms.drms_backend.repository;

import com.drms.drms_backend.entity.GoalRoutineLink;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface GoalRoutineLinkRepository extends JpaRepository<GoalRoutineLink, UUID> {
    List<GoalRoutineLink> findByGoalId(UUID goalId);
}
