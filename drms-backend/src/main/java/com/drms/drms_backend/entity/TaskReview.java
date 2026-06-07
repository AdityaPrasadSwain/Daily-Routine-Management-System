package com.drms.drms_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "task_reviews", indexes = {
    @Index(name = "idx_task_reviews_task_id", columnList = "task_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskReview {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private RoutineTask task;

    private Integer rating; // 1-5

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String mood;

    @Column(name = "review_date", updatable = false)
    private LocalDateTime reviewDate = LocalDateTime.now();
}
