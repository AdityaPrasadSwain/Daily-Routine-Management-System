package com.drms.drms_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "growth_stats")
@Data
@NoArgsConstructor
public class GrowthStats {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private Long totalAvoidedMinutes = 0L;

    private LocalDate lastLogDate = LocalDate.now();

    private Long todayAvoidedMinutes = 0L;

    private Integer growthScore = 0;

    private Integer focusLevel = 0;

    // Points needed for next level (starts at 50, decreases as score increases,
    // resets on level up)
    private Integer pointsForNextLevel = 50;
}
