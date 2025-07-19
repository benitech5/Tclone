package com.qwadwocodes.orbixa.features.other.service;

import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Primary;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@Primary
public class SmsServiceImpl implements SmsService {
    
    @Override
    public void sendOtp(String phoneNumber, String otp) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        System.out.println("=== MOCK SMS SENT ===");
        System.out.println("To: " + phoneNumber);
        System.out.println("Message: Your Orbixa OTP is: " + otp);
        System.out.println("Time: " + timestamp);
        System.out.println("=====================");
        
        // TODO: In production, integrate with actual SMS provider like:
        // - Twilio (paid)
        // - AWS SNS (paid)
        // - Firebase Phone Auth (free tier available)
        // - Custom SMS gateway
    }
} 
