package com.qwadwocodes.orbixa.features.auth.service;

import com.qwadwocodes.orbixa.features.auth.dto.AuthResponse;
import com.qwadwocodes.orbixa.features.auth.dto.OtpRequest;
import com.qwadwocodes.orbixa.features.auth.dto.VerifyOtpRequest;

public interface AuthService {
    void requestOtp(OtpRequest request);
    AuthResponse verifyOtp(VerifyOtpRequest request);
    void logout(String token);
    Long validateTokenAndGetUserId(String token);
} 
