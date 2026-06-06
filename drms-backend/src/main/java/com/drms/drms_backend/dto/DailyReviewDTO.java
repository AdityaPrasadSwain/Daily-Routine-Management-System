package com.drms.drms_backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class DailyReviewDTO {
    private UUID id;
    private LocalDate date;
    private String mood;
    private String wentWell;
    private String difficulties;
    private String improveTomorrow;
    private String energyLevel;
    private String suggestedAction;
}
