package com.drms.drms_backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.util.UUID;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String accessToken; // Renamed from 'token' to match frontend
    private String type; // "Bearer"
    private UUID id;
    private String username;
    private String email;
    private String role;
}
