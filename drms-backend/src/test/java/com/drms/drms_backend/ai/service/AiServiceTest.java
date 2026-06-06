package com.drms.drms_backend.ai.service;

import com.drms.drms_backend.ai.dto.request.AlarmMessageRequest;
import com.drms.drms_backend.ai.dto.request.GoalSuggestionRequest;
import com.drms.drms_backend.ai.dto.request.TaskBreakdownRequest;
import com.drms.drms_backend.ai.dto.response.AlarmMessageResponse;
import com.drms.drms_backend.ai.dto.response.DailyReviewResponse;
import com.drms.drms_backend.ai.dto.response.GoalSuggestionResponse;
import com.drms.drms_backend.ai.dto.response.TaskBreakdownResponse;
import com.drms.drms_backend.entity.RoutineTask;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.repository.RoutineTaskRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AiServiceTest {

        @Mock
        private ChatClient chatClient;
        @Mock
        private ChatClient.Builder chatClientBuilder;
        @Mock
        private ChatClient.CallResponseSpec callResponseSpec;
        @Mock
        private ChatClient.ChatClientRequestSpec chatClientRequestSpec;
        @Mock
        private ChatResponse chatResponse;
        @Mock
        private Generation generation;
        @Mock
        private RoutineTaskRepository routineTaskRepository;
        @Mock
        private ObjectMapper objectMapper;

        @InjectMocks
        private AiGoalService aiGoalService;
        @InjectMocks
        private AiTaskService aiTaskService;
        @InjectMocks
        private AiReviewService aiReviewService;
        @InjectMocks
        private AiAlarmService aiAlarmService;

        private User mockUser;

        @BeforeEach
        void setUp() throws Exception {
                // Setup mock user
                mockUser = new User();
                mockUser.setId(UUID.randomUUID());
                mockUser.setEmail("test@example.com");

                // Mock ChatClient builder chain
                // BaseAiService.isOllamaAvailable() creates a new builder instance each time
                when(chatClientBuilder.build()).thenReturn(chatClient);

                // Mock prompt() chain
                when(chatClient.prompt()).thenReturn(chatClientRequestSpec);
                when(chatClientRequestSpec.user(any(String.class))).thenReturn(chatClientRequestSpec);
                when(chatClientRequestSpec.call()).thenReturn(callResponseSpec);

                // Inject mocks into services (since they use field injection)
                // Note: @InjectMocks might miss inherited fields in some Mockito versions or
                // setups,
                // so we use ReflectionTestUtils to be safe for the protected fields in
                // BaseAiService

                // Setup ObjectMapper mock to return valid objects
                // We will mock objectMapper.readValue to avoid real JSON parsing of mock
                // strings
        }

        @Test
        void testSuggestGoal_Success() throws Exception {
                String jsonResponse = "json-response"; // Dummy string, we mock actual parsing
                when(callResponseSpec.content()).thenReturn(jsonResponse);

                GoalSuggestionResponse expectedResponse = new GoalSuggestionResponse(
                                "Improved Title",
                                "Improved Description",
                                Arrays.asList("Step 1", "Step 2"),
                                "MONTHLY",
                                "Reason");

                when(objectMapper.readValue(eq(jsonResponse), eq(GoalSuggestionResponse.class)))
                                .thenReturn(expectedResponse);

                GoalSuggestionRequest request = new GoalSuggestionRequest();
                request.setTitle("Learn Java");
                request.setDescription("I want to learn coding");

                GoalSuggestionResponse response = aiGoalService.suggestGoal(request, mockUser);

                assertNotNull(response);
                assertEquals("Learn Java Spring Boot", response.getImprovedDescription());
                assertEquals("MONTHLY", response.getSuggestedDuration());
        }

        @Test
        void testBreakdownGoal_Success() throws Exception {
                String jsonResponse = "json-response";
                when(callResponseSpec.content()).thenReturn(jsonResponse);

                TaskBreakdownResponse expectedResponse = new TaskBreakdownResponse(
                                Arrays.asList(new TaskBreakdownResponse.TaskSuggestion("Setup IDE", "HIGH", 30)));

                when(objectMapper.readValue(eq(jsonResponse), eq(TaskBreakdownResponse.class)))
                                .thenReturn(expectedResponse);

                TaskBreakdownRequest request = new TaskBreakdownRequest();
                request.setGoalTitle("Learn Java");
                request.setTargetDate(LocalDate.now().plusDays(7));

                TaskBreakdownResponse response = aiTaskService.breakdownGoal(request, mockUser);

                assertNotNull(response);
                assertEquals(1, response.getTasks().size());
                assertEquals("Setup IDE", response.getTasks().get(0).getTitle());
        }

        @Test
        void testGenerateDailyReview_Success() throws Exception {
                String jsonResponse = "json-response";
                when(callResponseSpec.content()).thenReturn(jsonResponse);

                DailyReviewResponse expectedResponse = new DailyReviewResponse(
                                "Great job today!", 80, "Improvement");

                when(objectMapper.readValue(eq(jsonResponse), eq(DailyReviewResponse.class)))
                                .thenReturn(expectedResponse);

                RoutineTask task1 = new RoutineTask();
                task1.setTitle("Task 1");
                task1.setStatus("COMPLETED");

                when(routineTaskRepository.findByUserAndDueDate(eq(mockUser), any(LocalDate.class)))
                                .thenReturn(Collections.singletonList(task1));

                DailyReviewResponse response = aiReviewService.generateDailyReview(mockUser);

                assertNotNull(response);
                assertEquals(80, response.getProductivityScore());
                assertEquals("Great job today!", response.getSummary());
        }

        @Test
        void testGenerateAlarmMessage_Success() throws Exception {
                String jsonResponse = "json-response";
                when(callResponseSpec.content()).thenReturn(jsonResponse);

                AlarmMessageResponse expectedResponse = new AlarmMessageResponse("Time to wake up!");
                when(objectMapper.readValue(eq(jsonResponse), eq(AlarmMessageResponse.class)))
                                .thenReturn(expectedResponse);

                AlarmMessageRequest request = new AlarmMessageRequest();
                request.setTaskTitle("Coding");
                request.setTime(LocalTime.of(8, 0));
                request.setAlarmType("Morning");

                AlarmMessageResponse response = aiAlarmService.generateAlarmMessage(request, mockUser);

                assertNotNull(response);
                assertEquals("Time to wake up!", response.getMessage());
        }
}
