package com.drms.drms_backend.repository;

import com.drms.drms_backend.entity.DailyReview;
import com.drms.drms_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DailyReviewRepository extends JpaRepository<DailyReview, UUID> {
    Optional<DailyReview> findByUserAndDate(User user, LocalDate date);

    List<DailyReview> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
}
