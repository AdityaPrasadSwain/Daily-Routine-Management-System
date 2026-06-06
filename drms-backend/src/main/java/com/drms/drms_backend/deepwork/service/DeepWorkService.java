package com.drms.drms_backend.deepwork.service;

import com.drms.drms_backend.ai.prompt.PromptTemplates;
import com.drms.drms_backend.deepwork.entity.DeepWorkSession;
import com.drms.drms_backend.deepwork.repository.DeepWorkSessionRepository;
import com.drms.drms_backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DeepWorkService {

    private final DeepWorkSessionRepository deepWorkSessionRepository;
    private final ChatClient.Builder chatClientBuilder;

    public DeepWorkSession startSession(User user, int plannedMinutes) {
        DeepWorkSession session = DeepWorkSession.builder()
                .user(user)
                .startTime(LocalDateTime.now())
                .plannedDurationMinutes(plannedMinutes)
                .build();
        return deepWorkSessionRepository.save(session);
    }

    public DeepWorkSession stopSession(java.util.UUID sessionId, int distractions, String notes) {
        DeepWorkSession session = deepWorkSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setEndTime(LocalDateTime.now());
        session.setDistractionCount(distractions);
        session.setUserNotes(notes);

        // Calculate actual duration
        java.time.Duration duration = java.time.Duration.between(session.getStartTime(), session.getEndTime());
        session.setActualDurationMinutes((int) duration.toMinutes());

        // Calculate Flow Score (Simple Algorithm + AI Enhancement potential)
        int baseScore = calculateBaseScore(session.getPlannedDurationMinutes(), session.getActualDurationMinutes(),
                distractions);
        session.setFlowScore(baseScore);

        // Generate AI Feedback
        String feedback = generateAiFeedback(session);
        session.setAiFeedback(feedback);

        return deepWorkSessionRepository.save(session);
    }

    private int calculateBaseScore(int planned, int actual, int distractions) {
        int score = 100;

        // Deduction for quitting early
        if (actual < planned) {
            double ratio = (double) actual / planned;
            score -= (1.0 - ratio) * 50;
        }

        // Deduction for distractions
        score -= (distractions * 5);

        return Math.max(0, Math.min(100, score));
    }

    private String generateAiFeedback(DeepWorkSession session) {
        try {
            // Simplified prompt injection
            String prompt = String.format("""
                    You are a productivity coach.
                    User Session:
                    - Planned: %d mins
                    - Actual: %d mins
                    - Distractions: %d
                    - Notes: %s

                    Provide a 1-sentence supportive feedback on their flow state.
                    """,
                    session.getPlannedDurationMinutes(),
                    session.getActualDurationMinutes(),
                    session.getDistractionCount(),
                    session.getUserNotes());

            return chatClientBuilder.build().prompt().user(prompt).call().content();
        } catch (Exception e) {
            return "Good hustle! Consistency is key.";
        }
    }
}
