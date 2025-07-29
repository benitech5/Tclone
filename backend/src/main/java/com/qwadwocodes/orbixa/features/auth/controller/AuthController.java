package com.qwadwocodes.orbixa.features.auth.controller;

import com.qwadwocodes.orbixa.features.auth.dto.AuthResponse;
import com.qwadwocodes.orbixa.features.auth.dto.OtpRequest;
import com.qwadwocodes.orbixa.features.auth.dto.VerifyOtpRequest;
import com.qwadwocodes.orbixa.features.auth.service.AuthService;
import com.qwadwocodes.orbixa.features.profile.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/request-otp")
    public ResponseEntity<Void> requestOtp(@RequestBody OtpRequest request) {
        authService.requestOtp(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody VerifyOtpRequest request) {
        AuthResponse response = authService.verifyOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String token) {
        // Extract token from "Bearer <token>" format
        String jwtToken = token.replace("Bearer ", "");
        authService.logout(jwtToken);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check-user-exist")
    public ResponseEntity<Map<String, Boolean>> checkUserExist(@RequestParam String phoneNumber) {
        boolean exists = userRepository.findByPhoneNumber(phoneNumber).isPresent();
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
}
