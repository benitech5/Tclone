package com.qwadwocodes.orbixa.features.other.service;

public interface OtpService {
    void saveOtp(String phone, String otp, long ttlMinutes);
    String getOtp(String phone);
    void deleteOtp(String phone);
    boolean isOtpValid(String phone, String otp);
} 
