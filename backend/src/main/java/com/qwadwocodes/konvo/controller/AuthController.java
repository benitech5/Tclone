package com.qwadwocodes.konvo.controller;

import com.qwadwocodes.konvo.dto.AuthResponse;
import com.qwadwocodes.konvo.dto.OtpRequest;
import com.qwadwocodes.konvo.dto.VerifyOtpRequest;
import com.qwadwocodes.konvo.service.AuthService;
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
}
