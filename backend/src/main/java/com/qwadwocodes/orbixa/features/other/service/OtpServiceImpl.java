package com.qwadwocodes.orbixa.features.other.service;

import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;

@Service
public class OtpServiceImpl implements OtpService {
    
    private final MockRedisService mockRedisService;
    
    public OtpServiceImpl(MockRedisService mockRedisService) {
        this.mockRedisService = mockRedisService;
    }
    
    @Override
    public void saveOtp(String phone, String otp, long ttlMinutes) {
        String key = "otp:" + phone;
        mockRedisService.set(key, otp, ttlMinutes, TimeUnit.MINUTES);
        System.out.println("=== OTP SAVED ===");
        System.out.println("Key: " + key);
        System.out.println("OTP: " + otp);
        System.out.println("TTL: " + ttlMinutes + " minutes");
        System.out.println("=================");
    }
    
    @Override
    public String getOtp(String phone) {
        String key = "otp:" + phone;
        String otp = mockRedisService.get(key);
        System.out.println("=== OTP RETRIEVED ===");
        System.out.println("Key: " + key);
        System.out.println("Retrieved OTP: " + otp);
        System.out.println("=====================");
        return otp;
    }
    
    @Override
    public void deleteOtp(String phone) {
        String key = "otp:" + phone;
        mockRedisService.delete(key);
        System.out.println("=== OTP DELETED ===");
        System.out.println("Key: " + key);
        System.out.println("===================");
    }
    
    public boolean isOtpValid(String phone, String otp) {
        String storedOtp = getOtp(phone);
        boolean isValid = storedOtp != null && storedOtp.equals(otp);
        System.out.println("=== OTP VALIDATION ===");
        System.out.println("Phone: " + phone);
        System.out.println("Provided OTP: " + otp);
        System.out.println("Stored OTP: " + storedOtp);
        System.out.println("Is Valid: " + isValid);
        System.out.println("======================");
        return isValid;
    }
} 
