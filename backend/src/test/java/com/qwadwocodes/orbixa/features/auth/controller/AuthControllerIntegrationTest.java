package com.qwadwocodes.orbixa.features.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qwadwocodes.orbixa.features.auth.dto.LoginRequest;
import com.qwadwocodes.orbixa.features.auth.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @Test
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void testRegister_Success() throws Exception {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setPhoneNumber("+1234567890");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPassword("password123");
        request.setOtp("123456");

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.userId").exists());
    }

    @Test
    void testRegister_InvalidRequest() throws Exception {
        // Given
        RegisterRequest request = new RegisterRequest();
        // Missing required fields

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLogin_Success() throws Exception {
        // Given
        LoginRequest request = new LoginRequest();
        request.setPhoneNumber("+1234567890");
        request.setPassword("password123");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.userId").exists());
    }

    @Test
    void testLogin_InvalidCredentials() throws Exception {
        // Given
        LoginRequest request = new LoginRequest();
        request.setPhoneNumber("+1234567890");
        request.setPassword("wrongpassword");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testSendOtp_Success() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/auth/send-otp")
                .param("phoneNumber", "+1234567890"))
                .andExpect(status().isOk())
                .andExpect(content().string("OTP sent successfully"));
    }

    @Test
    void testSendOtp_InvalidPhoneNumber() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/auth/send-otp")
                .param("phoneNumber", "invalid"))
                .andExpect(status().isBadRequest());
    }
} 