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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OtpService otpService;

    @Mock
    private SmsService smsService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;
    private OtpRequest otpRequest;
    private VerifyOtpRequest verifyOtpRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setPhoneNumber("+1234567890");
        testUser.setUsername("testuser");

        otpRequest = new OtpRequest();
        otpRequest.setPhoneNumber("+1234567890");
        otpRequest.setName("Test User");

        verifyOtpRequest = new VerifyOtpRequest();
        verifyOtpRequest.setPhoneNumber("+1234567890");
        verifyOtpRequest.setOtp("123456");
    }

    @Test
    void testRequestOtp_NewUser() {
        // Given
        when(userRepository.findByPhoneNumber("+1234567890")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        authService.requestOtp(otpRequest);

        // Then
        verify(otpService).saveOtp("+1234567890", anyString(), eq(10));
        verify(smsService).sendOtp("+1234567890", anyString());
        verify(userRepository).findByPhoneNumber("+1234567890");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testRequestOtp_ExistingUser() {
        // Given
        when(userRepository.findByPhoneNumber("+1234567890")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        authService.requestOtp(otpRequest);

        // Then
        verify(otpService).saveOtp("+1234567890", anyString(), eq(10));
        verify(smsService).sendOtp("+1234567890", anyString());
        verify(userRepository).findByPhoneNumber("+1234567890");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testVerifyOtp_Success() {
        // Given
        when(otpService.isOtpValid("+1234567890", "123456")).thenReturn(true);
        when(userRepository.findByPhoneNumber("+1234567890")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken("+1234567890")).thenReturn("jwt-token");

        // When
        AuthResponse result = authService.verifyOtp(verifyOtpRequest);

        // Then
        assertNotNull(result);
        assertEquals("jwt-token", result.getToken());
        assertNotNull(result.getUser());
        verify(otpService).isOtpValid("+1234567890", "123456");
        verify(otpService).deleteOtp("+1234567890");
        verify(userRepository).findByPhoneNumber("+1234567890");
        verify(userRepository).save(any(User.class));
        verify(jwtUtil).generateToken("+1234567890");
    }

    @Test
    void testVerifyOtp_InvalidOtp() {
        // Given
        when(otpService.isOtpValid("+1234567890", "123456")).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            authService.verifyOtp(verifyOtpRequest);
        });
        verify(otpService).isOtpValid("+1234567890", "123456");
        verify(otpService, never()).deleteOtp(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testVerifyOtp_UserNotFound() {
        // Given
        when(otpService.isOtpValid("+1234567890", "123456")).thenReturn(true);
        when(userRepository.findByPhoneNumber("+1234567890")).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            authService.verifyOtp(verifyOtpRequest);
        });
        verify(otpService).isOtpValid("+1234567890", "123456");
        verify(userRepository).findByPhoneNumber("+1234567890");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLogout() {
        // When
        authService.logout("test-token");

        // Then
        // Just verify the method doesn't throw an exception
        // The actual implementation just logs for now
    }

    @Test
    void testValidateTokenAndGetUserId_Success() {
        // Given
        when(jwtUtil.validateTokenAndGetPhoneNumber("valid-token")).thenReturn("+1234567890");
        when(userRepository.findByPhoneNumber("+1234567890")).thenReturn(Optional.of(testUser));

        // When
        Long result = authService.validateTokenAndGetUserId("valid-token");

        // Then
        assertEquals(1L, result);
        verify(jwtUtil).validateTokenAndGetPhoneNumber("valid-token");
        verify(userRepository).findByPhoneNumber("+1234567890");
    }

    @Test
    void testValidateTokenAndGetUserId_InvalidToken() {
        // Given
        when(jwtUtil.validateTokenAndGetPhoneNumber("invalid-token")).thenThrow(new RuntimeException("Invalid token"));

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            authService.validateTokenAndGetUserId("invalid-token");
        });
        verify(jwtUtil).validateTokenAndGetPhoneNumber("invalid-token");
        verify(userRepository, never()).findByPhoneNumber(anyString());
    }

    @Test
    void testValidateTokenAndGetUserId_UserNotFound() {
        // Given
        when(jwtUtil.validateTokenAndGetPhoneNumber("valid-token")).thenReturn("+1234567890");
        when(userRepository.findByPhoneNumber("+1234567890")).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            authService.validateTokenAndGetUserId("valid-token");
        });
        verify(jwtUtil).validateTokenAndGetPhoneNumber("valid-token");
        verify(userRepository).findByPhoneNumber("+1234567890");
    }
} 