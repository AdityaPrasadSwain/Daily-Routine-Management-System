package com.drms.drms_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserDTO {
    private UUID id;
    private String username;
    private String email;
    private String role;
    private String profilePhoto;
    private LocalDateTime createdAt;
}
