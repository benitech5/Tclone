package com.qwadwocodes.orbixa.features.profile.controller;

import com.qwadwocodes.orbixa.features.profile.dto.UserDto;
import com.qwadwocodes.orbixa.features.profile.model.User;
import com.qwadwocodes.orbixa.features.profile.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    
    private final ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = profileService.getUserByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserDto userDto = profileService.getUserProfile(user.getId());
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails, 
            @RequestBody UserDto updateDto) {
        
        User user = profileService.getUserByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserDto updatedProfile = profileService.updateUserProfile(user.getId(), updateDto);
        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserProfile(@PathVariable Long userId) {
        UserDto userDto = profileService.getUserProfile(userId);
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/{userId}/picture")
    public ResponseEntity<Void> updateProfilePicture(
            @PathVariable Long userId,
            @RequestParam String pictureUrl) {
        
        profileService.updateProfilePicture(userId, pictureUrl);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{userId}/status")
    public ResponseEntity<Void> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam boolean isOnline) {
        
        profileService.updateUserStatus(userId, isOnline);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> searchUsers(@RequestParam String query) {
        List<UserDto> users = profileService.searchUsers(query);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/online")
    public ResponseEntity<List<UserDto>> getOnlineUsers() {
        List<UserDto> users = profileService.getOnlineUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{userId}/bio")
    public ResponseEntity<Void> updateUserBio(
            @PathVariable Long userId,
            @RequestParam String bio) {
        
        profileService.updateUserBio(userId, bio);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{userId}/username")
    public ResponseEntity<Void> updateUsername(
            @PathVariable Long userId,
            @RequestParam String newUsername) {
        
        profileService.updateUsername(userId, newUsername);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/username/{username}/available")
    public ResponseEntity<Boolean> isUsernameAvailable(@PathVariable String username) {
        boolean available = profileService.isUsernameAvailable(username);
        return ResponseEntity.ok(available);
    }

    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<Optional<User>> getUserByPhoneNumber(@PathVariable String phoneNumber) {
        Optional<User> user = profileService.getUserByPhoneNumber(phoneNumber);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUserProfile(@PathVariable Long userId) {
        profileService.deleteUserProfile(userId);
        return ResponseEntity.ok().build();
    }
} 
