package com.drms.drms_backend.socialmedia.repository;

import com.drms.drms_backend.socialmedia.entity.SocialMediaBudget;
import com.drms.drms_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SocialMediaBudgetRepository extends JpaRepository<SocialMediaBudget, UUID> {
    Optional<SocialMediaBudget> findByUser(User user);
}
