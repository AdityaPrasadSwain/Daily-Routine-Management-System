package com.drms.drms_backend.socialmedia.repository;

import com.drms.drms_backend.socialmedia.entity.SocialMediaLog;
import com.drms.drms_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface SocialMediaLogRepository extends JpaRepository<SocialMediaLog, UUID> {
    List<SocialMediaLog> findByUserAndDate(User user, LocalDate date);

    List<SocialMediaLog> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
}
