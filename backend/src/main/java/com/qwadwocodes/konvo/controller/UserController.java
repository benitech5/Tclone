package com.qwadwocodes.konvo.controller;

import com.qwadwocodes.konvo.dto.UserDto;
import com.qwadwocodes.konvo.model.User;
import com.qwadwocodes.konvo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserDto userDto = new UserDto(user.getId(), user.getFirstName(), user.getPhoneNumber(), user.getProfilePictureUrl());
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateProfile(@AuthenticationPrincipal UserDetails userDetails, @RequestBody UserDto updateDto) {
        User user = userRepository.findByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setFirstName(updateDto.getFirstName());
        user.setProfilePictureUrl(updateDto.getProfilePictureUrl());
        userRepository.save(user);
        UserDto userDto = new UserDto(user.getId(), user.getFirstName(), user.getPhoneNumber(), user.getProfilePictureUrl());
        return ResponseEntity.ok(userDto);
    }
} 