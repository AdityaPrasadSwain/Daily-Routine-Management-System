package com.drms.drms_backend.ai.service;

import com.drms.drms_backend.ai.dto.response.FocusScoreResponse;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.repository.RoutineTaskRepository;
import com.drms.drms_backend.repository.TaskAlarmRepository;
import com.drms.drms_backend.socialmedia.entity.SocialMediaLog;
import com.drms.drms_backend.socialmedia.repository.SocialMediaLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.client.ChatClient;
import java.time.LocalDate;
import java.util.Collections;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AiProductivityServiceTest {

    @Mock
    private SocialMediaLogRepository socialMediaLogRepository;
    @Mock
    private RoutineTaskRepository taskRepository;
    @Mock
    private TaskAlarmRepository alarmRepository;
    @Mock
    private ChatClient chatClient;
    @Mock
    private ChatClient.Builder chatClientBuilder;
    @Mock
    private ChatClient.ChatClientRequestSpec chatClientRequestSpec;
    @Mock
    private ChatClient.CallResponseSpec callResponseSpec;

    @InjectMocks
    private FocusScoreService focusScoreService;
    @InjectMocks
    private MentalLoadService mentalLoadService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(UUID.randomUUID());
        mockUser.setEmail("test@example.com");
        mockUser.setIdentityArchetype("BALANCED_BUILDER");
    }

    @Test
    void testCalculateDailyScore_HighFocus() {
        // Mock 10 minutes of social media usage (Score: 100 - 5 = 95)
        SocialMediaLog log1 = new SocialMediaLog();
        log1.setMinutesSpent(10);
        when(socialMediaLogRepository.findByUserAndDate(eq(mockUser), any(LocalDate.class)))
                .thenReturn(Collections.singletonList(log1));

        FocusScoreResponse response = focusScoreService.calculateDailyScore(mockUser);

        assertNotNull(response);
        assertEquals(95, response.getScore());
        assertEquals("UP", response.getTrend());
        assertFalse(response.isDriftDetected());

        // Verify identity-based explanation
        assertTrue(response.getExplanation().contains("BALANCED_BUILDER"));
    }

    @Test
    void testCalculateDailyScore_LowFocus_Drift() {
        // Mock 130 minutes of social media usage (Score: 100 - 65 = 35)
        // Drift > 120 mins
        SocialMediaLog log1 = new SocialMediaLog();
        log1.setMinutesSpent(130);
        when(socialMediaLogRepository.findByUserAndDate(eq(mockUser), any(LocalDate.class)))
                .thenReturn(Collections.singletonList(log1));

        FocusScoreResponse response = focusScoreService.calculateDailyScore(mockUser);

        assertNotNull(response);
        assertEquals(35, response.getScore());
        assertEquals("DOWN", response.getTrend());
        assertTrue(response.isDriftDetected());

        // Verify identity-based explanation
        assertTrue(response.getExplanation().contains("BALANCED_BUILDER"));
    }

    @Test
    void testAnalyzeMentalLoad_Success() {
        // Mock Repository Data
        when(taskRepository.countByUserAndStatusNot(eq(mockUser), eq("COMPLETED"))).thenReturn(5L);
        when(alarmRepository.countByTask_UserAndIsActiveTrue(eq(mockUser))).thenReturn(2L);
        when(socialMediaLogRepository.findByUserAndDate(eq(mockUser), any(LocalDate.class)))
                .thenReturn(Collections.emptyList());

        // Mock ChatClient
        String expectedAiResponse = "{\"status\": \"MODERATE\", \"suggestion\": \"Take a break.\"}";

        // We need to mock the chain: chatClient.prompt().user(...).call().content()
        when(chatClient.prompt()).thenReturn(chatClientRequestSpec);
        when(chatClientRequestSpec.user(anyString())).thenReturn(chatClientRequestSpec);
        when(chatClientRequestSpec.call()).thenReturn(callResponseSpec);
        when(callResponseSpec.content()).thenReturn(expectedAiResponse);

        String response = mentalLoadService.analyzeMentalLoad(mockUser);

        assertNotNull(response);
        assertEquals(expectedAiResponse, response);
    }
}
