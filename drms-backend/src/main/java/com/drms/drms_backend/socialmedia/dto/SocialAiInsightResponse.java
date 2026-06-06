package com.drms.drms_backend.socialmedia.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SocialAiInsightResponse {
    private String insight;
    private String replacementTask; // For specific endpoint
    private List<String> habitSuggestions;
    private String moodAnalysis;
}
