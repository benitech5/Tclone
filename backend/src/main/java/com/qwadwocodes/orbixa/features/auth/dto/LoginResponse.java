package com.qwadwocodes.orbixa.features.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private Long userId;
    private String phoneNumber;
    private String firstName;
    private String lastName;
} 