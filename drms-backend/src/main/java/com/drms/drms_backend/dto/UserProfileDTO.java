package com.drms.drms_backend.dto;

import com.drms.drms_backend.entity.User;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class UserProfileDTO {
    private UUID id;
    private String username;
    private String name;
    private String email;
    private String role;
    private String profilePhoto;
    private LocalDateTime createdAt;

    public UserProfileDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.profilePhoto = user.getProfilePhoto();
        this.createdAt = user.getCreatedAt();
    }
}
