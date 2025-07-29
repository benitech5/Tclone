package com.qwadwocodes.orbixa.features.auth.service;

import com.qwadwocodes.orbixa.features.auth.dto.AuthResponse;
import com.qwadwocodes.orbixa.features.auth.dto.OtpRequest;
import com.qwadwocodes.orbixa.features.auth.dto.VerifyOtpRequest;
import com.qwadwocodes.orbixa.features.other.service.OtpService;
import com.qwadwocodes.orbixa.features.other.service.SmsService;
import com.qwadwocodes.orbixa.features.profile.dto.UserDto;
import com.qwadwocodes.orbixa.features.profile.model.User;
import com.qwadwocodes.orbixa.features.profile.repository.UserRepository;
import com.qwadwocodes.orbixa.security.JwtUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final SmsService smsService;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository, 
                         OtpService otpService, 
                         SmsService smsService, 
                         JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.smsService = smsService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void requestOtp(OtpRequest request) {
        // Generate a 6-digit OTP
        String otp = generateOtp();
        
        // Save OTP to Redis with 10 minutes TTL
        otpService.saveOtp(request.getPhoneNumber(), otp, 10);
        
        // Only update OTP fields if user exists
        userRepository.findByPhoneNumber(request.getPhoneNumber()).ifPresent(user -> {
            user.setOtp(otp);
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
            userRepository.save(user);
        });

        // Send OTP via SMS
        smsService.sendOtp(request.getPhoneNumber(), otp);
    }

    @Override
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        // Verify OTP from Redis
        if (!otpService.isOtpValid(request.getPhoneNumber(), request.getOtp())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP");
        }

        // Get user from database
        Optional<User> userOpt = userRepository.findByPhoneNumber(request.getPhoneNumber());
        
        User user;
        if (userOpt.isPresent()) {
            // Existing user
            user = userOpt.get();
            // Clear OTP from both Redis and database
            otpService.deleteOtp(request.getPhoneNumber());
            user.setOtp(null);
            user.setOtpExpiry(null);
            user.setLastSeen(LocalDateTime.now());
            user.setOnline(true);
            userRepository.save(user);
        } else {
            // New user - create temporary user for OTP verification
            user = new User();
            user.setPhoneNumber(request.getPhoneNumber());
            user.setFirstName(""); // Will be set during profile setup
            user.setLastName(""); // Will be set during profile setup
            user.setUsername(""); // Will be set during profile setup
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            user.setOnline(false);
            user.setLastSeen(LocalDateTime.now());
            
            // Save the temporary user
            user = userRepository.save(user);
            
            // Clear OTP from Redis
            otpService.deleteOtp(request.getPhoneNumber());
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getPhoneNumber());
        
        // Create user DTO
        UserDto userDto = new UserDto(
            user.getId(), 
            user.getFirstName(), 
            user.getLastName(),
            user.getOtherName(),
            user.getPhoneNumber(), 
            user.getProfilePictureUrl(),
            user.getUsername()
        );

        return new AuthResponse(token, userDto);
    }

    @Override
    public void logout(String token) {
        // TODO: Implement token blacklisting or session invalidation
        // For now, just log the logout
        System.out.println("User logged out with token: " + token);
    }

    @Override
    public Long validateTokenAndGetUserId(String token) {
        try {
            // Validate token and extract phone number
            String phoneNumber = jwtUtil.validateTokenAndGetPhoneNumber(token);
            
            // Find user by phone number
            User user = userRepository.findByPhoneNumber(phoneNumber)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            return user.getId();
        } catch (Exception e) {
            throw new RuntimeException("Invalid token: " + e.getMessage());
        }
    }

    private String generateOtp() {
        // Generate a 6-digit OTP
        return String.format("%06d", new Random().nextInt(999999));
    }
} 
