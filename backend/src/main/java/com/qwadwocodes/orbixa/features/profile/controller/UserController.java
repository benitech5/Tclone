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
    public ResponseEntity<UserDto> getUserByPhoneNumber(@PathVariable String phoneNumber) {
        Optional<User> userOpt = profileService.getUserByPhoneNumber(phoneNumber);
        if (userOpt.isPresent()) {
            UserDto userDto = profileService.getUserProfile(userOpt.get().getId());
            return ResponseEntity.ok(userDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<UserDto> createUserProfile(@RequestBody UserDto userDto) {
        // Validate firstName
        if (userDto.getFirstName() == null || userDto.getFirstName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        // Validate username
        String username = userDto.getUsername();
        if (username == null || !username.startsWith("@") || username.length() < 5) {
            return ResponseEntity.badRequest().body(null);
        }
        // Check for at least 2 special characters or numbers (not letters)
        int specialOrDigitCount = 0;
        for (char c : username.toCharArray()) {
            if (!Character.isLetter(c)) {
                specialOrDigitCount++;
            }
        }
        if (specialOrDigitCount < 2) {
            return ResponseEntity.badRequest().body(null);
        }
        UserDto createdUser = profileService.createUserProfile(userDto);
        return ResponseEntity.ok(createdUser);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUserProfile(@PathVariable Long userId) {
        profileService.deleteUserProfile(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/me/link-account")
    public ResponseEntity<Void> linkAccount(@AuthenticationPrincipal UserDetails userDetails, @RequestParam Long otherUserId) {
        // Implement logic to link the current user to another account (otherUserId)
        // This could involve adding a record to a LinkedAccounts table or a field in the User entity
        // For now, just log and return OK
        System.out.println("Linking account: " + userDetails.getUsername() + " to userId: " + otherUserId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/me/unlink-account")
    public ResponseEntity<Void> unlinkAccount(@AuthenticationPrincipal UserDetails userDetails, @RequestParam Long otherUserId) {
        // Implement logic to unlink the current user from another account (otherUserId)
        // For now, just log and return OK
        System.out.println("Unlinking account: " + userDetails.getUsername() + " from userId: " + otherUserId);
        return ResponseEntity.ok().build();
    }
} 
