package com.drms.drms_backend.repository;

import com.drms.drms_backend.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GoalRepository extends JpaRepository<Goal, UUID> {
    List<Goal> findByUserId(UUID userId);

    List<Goal> findByUser(com.drms.drms_backend.entity.User user);
}
