package com.drms.drms_backend.repository;

import com.drms.drms_backend.entity.TaskReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskReviewRepository extends JpaRepository<TaskReview, UUID> {
    Optional<TaskReview> findByTaskId(UUID taskId);
}
