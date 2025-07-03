package com.qwadwocodes.konvo.service;

public interface SmsService {
    /**
     * Send OTP via SMS to the specified phone number
     * @param phoneNumber The phone number to send the OTP to
     * @param otp The OTP code to send
     * @throws Exception if SMS sending fails
     */
    void sendOtp(String phoneNumber, String otp) throws Exception;
} 