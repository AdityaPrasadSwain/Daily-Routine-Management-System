package com.drms.drms_backend.ai.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LifeBalanceResponse {
    private Map<String, Integer> distribution;
    private String analysis;
    private boolean balanced;
}
