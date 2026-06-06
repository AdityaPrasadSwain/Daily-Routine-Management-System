package com.drms.drms_backend.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String username;
    private String password;

    // Field used by Frontend Login/Register auto-login
    private String usernameOrEmail;

    // Field used by Frontend Register
    private String name;
}
