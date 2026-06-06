package com.drms.drms_backend.repository;

import com.drms.drms_backend.entity.GrowthStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GrowthStatsRepository extends JpaRepository<GrowthStats, UUID> {
    Optional<GrowthStats> findByUserId(UUID userId);
}
