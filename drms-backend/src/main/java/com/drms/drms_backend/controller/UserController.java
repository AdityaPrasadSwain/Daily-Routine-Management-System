package com.drms.drms_backend.controller;

import com.drms.drms_backend.dto.UserProfileDTO;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.repository.UserRepository;
import com.drms.drms_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    private static final String UPLOAD_DIR = java.nio.file.Paths.get("uploads/profiles/").toAbsolutePath().toString();

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(new UserProfileDTO(user));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> updates) {

        // Update name if provided
        if (updates.containsKey("name")) {
            user.setName(updates.get("name"));
        }

        // Update username if provided and not taken
        if (updates.containsKey("username")) {
            String newUsername = updates.get("username");
            if (!newUsername.equals(user.getUsername()) &&
                    userRepository.existsByUsername(newUsername)) {
                return ResponseEntity.badRequest().body("Username already taken");
            }
            user.setUsername(newUsername);
        }

        userRepository.save(user);
        return ResponseEntity.ok(new UserProfileDTO(user));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> passwordData) {

        try {
            userService.changePassword(
                    user.getEmail(),
                    passwordData.get("currentPassword"),
                    passwordData.get("newPassword"));
            return ResponseEntity.ok("Password changed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/photo")
    public ResponseEntity<?> uploadProfilePhoto(
            @AuthenticationPrincipal User user,
            @RequestParam("photo") MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded");
        }

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);

        // Save file
        Files.copy(file.getInputStream(), filePath);

        // Update user profile photo
        user.setProfilePhoto(filename);
        userRepository.save(user);

        return ResponseEntity.ok(new UserProfileDTO(user));
    }
}
