package com.qwadwocodes.konvo.dto;

import lombok.Data;

@Data
public class VerifyOtpRequest {
    private String phoneNumber;
    private String otp;
} 