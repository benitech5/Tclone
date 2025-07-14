package com.qwadwocodes.konvo.service;

import com.qwadwocodes.konvo.dto.AuthResponse;
import com.qwadwocodes.konvo.dto.OtpRequest;
import com.qwadwocodes.konvo.dto.UserDto;
import com.qwadwocodes.konvo.dto.VerifyOtpRequest;
import com.qwadwocodes.konvo.model.User;
import com.qwadwocodes.konvo.repository.UserRepository;
import com.qwadwocodes.konvo.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final SmsService smsService;

    public void requestOtp(OtpRequest request) {
        String otp = generateOtp();
        log.info("Generated OTP for {}: {}", request.getPhoneNumber(), otp); // Log OTP for testing

        User user = userRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseGet(() -> User.builder()
                        .firstName(request.getName())
                        .phoneNumber(request.getPhoneNumber())
                        .isOnline(false)
                        .build());

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        // Send OTP via SMS
        smsService.sendOtp(request.getPhoneNumber(), otp);
    }

    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        User user = userRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new RuntimeException("User not found with phone number: " + request.getPhoneNumber()));

        if (user.getOtp() == null || !user.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }

        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getPhoneNumber());
        UserDto userDto = new UserDto(user.getId(), user.getFirstName(), user.getPhoneNumber(), user.getProfilePictureUrl());

        return new AuthResponse(token, userDto);
    }

    private String generateOtp() {
        // Generate a 6-digit OTP
        return String.format("%06d", new Random().nextInt(999999));
    }
}
