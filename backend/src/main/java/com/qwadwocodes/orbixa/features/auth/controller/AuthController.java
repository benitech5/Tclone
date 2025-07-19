package com.qwadwocodes.orbixa.features.auth.controller;

import com.qwadwocodes.orbixa.features.auth.dto.AuthResponse;
import com.qwadwocodes.orbixa.features.auth.dto.OtpRequest;
import com.qwadwocodes.orbixa.features.auth.dto.VerifyOtpRequest;
import com.qwadwocodes.orbixa.features.auth.service.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

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
}
