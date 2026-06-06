package com.drms.drms_backend.repository;

import com.drms.drms_backend.model.WeeklyReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WeeklyReviewRepository extends JpaRepository<WeeklyReview, UUID> {
    Optional<WeeklyReview> findByUserIdAndStartDate(UUID userId, LocalDate startDate);

    Optional<WeeklyReview> findFirstByUserIdOrderByStartDateDesc(UUID userId);
}
