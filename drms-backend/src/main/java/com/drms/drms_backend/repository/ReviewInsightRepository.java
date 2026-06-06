package com.drms.drms_backend.repository;

import com.drms.drms_backend.model.ReviewInsight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReviewInsightRepository extends JpaRepository<ReviewInsight, UUID> {
}
