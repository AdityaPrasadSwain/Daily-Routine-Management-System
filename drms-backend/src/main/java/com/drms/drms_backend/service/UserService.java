package com.drms.drms_backend.service;

import com.drms.drms_backend.dto.AuthRequest;
import com.drms.drms_backend.dto.AuthResponse;
import com.drms.drms_backend.config.JwtUtil;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        if (request.getUsername() != null && userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }

        User user = new User();
        // Use provided username, or generate one from email if missing
        if (request.getUsername() != null && !request.getUsername().isEmpty()) {
            user.setUsername(request.getUsername());
        } else {
            user.setUsername(extractNameFromEmail(request.getEmail()));
        }

        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setName(request.getName());

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, "Bearer", user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }

    public AuthResponse login(AuthRequest request) {
        String loginIdentifier = request.getUsernameOrEmail();

        // Fallback for direct API usage
        if (loginIdentifier == null || loginIdentifier.isEmpty()) {
            loginIdentifier = request.getEmail();
        }

        if (loginIdentifier == null || loginIdentifier.isEmpty()) {
            throw new RuntimeException("Username or Email is required");
        }

        User user;
        if (loginIdentifier.contains("@")) {
            user = userRepository.findByEmail(loginIdentifier)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        } else {
            user = userRepository.findByUsername(loginIdentifier)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, "Bearer", user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void forgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        // Don't reveal if email exists or not (security best practice)
        if (userOptional.isEmpty()) {
            return;
        }

        User user = userOptional.get();

        // Generate reset token
        String resetToken = java.util.UUID.randomUUID().toString();

        // Set expiry to 1 hour from now
        java.time.LocalDateTime expiry = java.time.LocalDateTime.now().plusHours(1);

        // Save token to user
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(expiry);
        userRepository.save(user);

        // Log reset link to console (simulating email)
        String resetLink = "http://localhost:5178/reset-password?token=" + resetToken;
        System.out.println("\n" + "=".repeat(80));
        System.out.println("PASSWORD RESET REQUEST");
        System.out.println("=".repeat(80));
        System.out.println("Email: " + email);
        System.out.println("Reset Link: " + resetLink);
        System.out.println("Token expires at: " + expiry);
        System.out.println("=".repeat(80) + "\n");
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        // Check if token has expired
        if (user.getResetTokenExpiry() == null ||
                user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired reset token");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));

        // Invalidate token
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);

        System.out.println("\n" + "=".repeat(80));
        System.out.println("PASSWORD RESET SUCCESSFUL");
        System.out.println("=".repeat(80));
        System.out.println("Email: " + user.getEmail());
        System.out.println("Password updated at: " + java.time.LocalDateTime.now());
        System.out.println("=".repeat(80) + "\n");
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Update to new password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private String extractNameFromEmail(String email) {
        return email.split("@")[0];
    }
}
