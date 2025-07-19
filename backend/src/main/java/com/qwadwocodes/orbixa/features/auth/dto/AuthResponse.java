package com.qwadwocodes.orbixa.features.auth.dto;

import com.qwadwocodes.orbixa.features.profile.dto.UserDto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserDto user;
}
