package com.drms.drms_backend.repository;

import com.drms.drms_backend.entity.GoalReflection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface GoalReflectionRepository extends JpaRepository<GoalReflection, UUID> {
    List<GoalReflection> findByGoalIdOrderByReflectionDateDesc(UUID goalId);
}
