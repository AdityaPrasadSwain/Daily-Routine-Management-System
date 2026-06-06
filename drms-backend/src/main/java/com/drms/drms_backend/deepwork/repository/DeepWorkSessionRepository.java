package com.drms.drms_backend.deepwork.repository;

import com.drms.drms_backend.deepwork.entity.DeepWorkSession;
import com.drms.drms_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeepWorkSessionRepository extends JpaRepository<DeepWorkSession, UUID> {
    List<DeepWorkSession> findByUserOrderByStartTimeDesc(User user);
}
