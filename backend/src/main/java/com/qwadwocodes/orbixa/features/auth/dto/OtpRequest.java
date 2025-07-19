package com.qwadwocodes.orbixa.features.auth.dto;

import lombok.Data;

@Data
public class OtpRequest {
    private String phoneNumber;
    private String name;
} 
