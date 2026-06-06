package com.drms.drms_backend.service;

import com.drms.drms_backend.dto.DailyReviewDTO;
import com.drms.drms_backend.entity.DailyReview;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.repository.DailyReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class DailyReviewService {

    @Autowired
    private DailyReviewRepository dailyReviewRepository;

    private final Random random = new Random();

    public DailyReviewDTO saveDailyReview(DailyReviewDTO dto, User user) {
        DailyReview review;

        // Check if review already exists for today to update it
        Optional<DailyReview> existing = dailyReviewRepository.findByUserAndDate(user, LocalDate.now());
        if (existing.isPresent()) {
            review = existing.get();
        } else {
            review = new DailyReview();
            review.setUser(user);
            review.setDate(LocalDate.now());
        }

        review.setMood(dto.getMood());
        review.setWentWell(dto.getWentWell());
        review.setDifficulties(dto.getDifficulties());
        review.setImproveTomorrow(dto.getImproveTomorrow());
        review.setEnergyLevel(dto.getEnergyLevel());

        // Generate Suggested Action if not present
        if (review.getSuggestedAction() == null || review.getSuggestedAction().isEmpty()) {
            review.setSuggestedAction(generateSuggestedAction(dto));
        }

        DailyReview saved = dailyReviewRepository.save(review);
        return convertToDTO(saved);
    }

    public Optional<DailyReviewDTO> getReviewForToday(User user) {
        return dailyReviewRepository.findByUserAndDate(user, LocalDate.now())
                .map(this::convertToDTO);
    }

    public List<DailyReviewDTO> getWeeklyReviews(User user) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(6);
        return dailyReviewRepository.findByUserAndDateBetween(user, start, end).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public int calculateCurrentStreak(User user) {
        List<LocalDate> dates = dailyReviewRepository.findAll().stream()
                .filter(r -> r.getUser().getId().equals(user.getId()))
                .map(DailyReview::getDate)
                .sorted((d1, d2) -> d2.compareTo(d1)) // Descending
                .distinct()
                .collect(Collectors.toList());

        if (dates.isEmpty())
            return 0;

        int streak = 0;
        LocalDate checkDate = LocalDate.now();

        // If today is not present, check if yesterday is present to keep streak alive
        if (!dates.contains(checkDate)) {
            if (dates.contains(checkDate.minusDays(1))) {
                checkDate = checkDate.minusDays(1);
            } else {
                return 0;
            }
        }

        for (LocalDate date : dates) {
            if (date.equals(checkDate)) {
                streak++;
                checkDate = checkDate.minusDays(1);
            } else if (date.isBefore(checkDate)) {
                break;
            }
        }
        return streak;
    }

    private String generateSuggestedAction(DailyReviewDTO dto) {
        // Simple Rule-Based Action Bridge
        if ("LOW".equalsIgnoreCase(dto.getEnergyLevel()) || "TIRED".equalsIgnoreCase(dto.getMood())) {
            String[] lowEnergyTips = {
                    "Try a 10-minute mindfulness meditation.",
                    "Drink a glass of water and stretch for 5 minutes.",
                    "Go to bed 30 minutes earlier tonight.",
                    "Listen to some calming music."
            };
            return lowEnergyTips[random.nextInt(lowEnergyTips.length)];
        }

        if (dto.getDifficulties() != null && !dto.getDifficulties().isEmpty()) {
            String[] difficultyTips = {
                    "Break down your hardest task into 3 small steps for tomorrow.",
                    "Discuss your blocker with a friend or colleague.",
                    "Try the Pomodoro technique tomorrow (25 min work, 5 min break)."
            };
            return difficultyTips[random.nextInt(difficultyTips.length)];
        }

        if ("HIGH".equalsIgnoreCase(dto.getEnergyLevel())) {
            String[] highEnergyTips = {
                    "Channel this energy into your most creative task tomorrow.",
                    "Plan a workout for tomorrow morning.",
                    "Tackle that backlog item you've been putting off."
            };
            return highEnergyTips[random.nextInt(highEnergyTips.length)];
        }

        return "Review your goals for the week.";
    }

    private DailyReviewDTO convertToDTO(DailyReview entity) {
        DailyReviewDTO dto = new DailyReviewDTO();
        dto.setId(entity.getId());
        dto.setDate(entity.getDate());
        dto.setMood(entity.getMood());
        dto.setWentWell(entity.getWentWell());
        dto.setDifficulties(entity.getDifficulties());
        dto.setImproveTomorrow(entity.getImproveTomorrow());
        dto.setEnergyLevel(entity.getEnergyLevel());
        dto.setSuggestedAction(entity.getSuggestedAction());
        return dto;
    }
}
