package com.doctrina.space.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String token;
    private String fullName;
    private String email;
    private String password;
}
