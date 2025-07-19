package com.qwadwocodes.orbixa.features.auth.dto;

import lombok.Data;

@Data
public class VerifyOtpRequest {
    private String phoneNumber;
    private String otp;
} 
