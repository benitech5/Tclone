package com.qwadwocodes.konvo.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("dev") // Only use this in development profile
@Slf4j
public class MockSmsService implements SmsService {
    
    @Override
    public void sendOtp(String phoneNumber, String otp) throws Exception {
        // In development, we'll log that SMS would be sent but not the actual OTP
        log.info("MOCK SMS: Would send OTP to phone number: {}", phoneNumber);
        log.info("MOCK SMS: OTP for {} is: {}", phoneNumber, otp);
        
        // Simulate some processing time
        Thread.sleep(100);
        
        // In a real implementation, this would send the actual SMS
        // For now, we're just simulating success
    }
} 