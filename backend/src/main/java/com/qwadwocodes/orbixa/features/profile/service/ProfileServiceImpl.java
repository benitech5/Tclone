package com.qwadwocodes.orbixa.features.profile.service;

import com.qwadwocodes.orbixa.features.profile.dto.UserDto;
import com.qwadwocodes.orbixa.features.profile.model.User;
import com.qwadwocodes.orbixa.features.profile.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;

    public ProfileServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        return convertToDto(user);
    }

    @Override
    public UserDto updateUserProfile(Long userId, UserDto userDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Update fields if provided
        if (userDto.getFirstName() != null && !userDto.getFirstName().trim().isEmpty()) {
            user.setFirstName(userDto.getFirstName());
        }

        // Update profile picture if provided
        if (userDto.getProfilePictureUrl() != null) {
            user.setProfilePictureUrl(userDto.getProfilePictureUrl());
        }

        // Update timestamp
        user.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    @Override
    public void updateProfilePicture(Long userId, String pictureUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setProfilePictureUrl(pictureUrl);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public void updateUserStatus(Long userId, boolean isOnline) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setOnline(isOnline);
        if (!isOnline) {
            user.setLastSeen(LocalDateTime.now());
        }
        userRepository.save(user);
    }

    @Override
    public void updateLastSeen(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setLastSeen(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public List<UserDto> searchUsers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }

        // TODO: Implement proper search with LIKE queries in repository
        // For now, get all users and filter in memory
        return userRepository.findAll().stream()
                .filter(user -> 
                    (user.getFirstName() != null && user.getFirstName().toLowerCase().contains(query.toLowerCase())) ||
                    (user.getUsername() != null && user.getUsername().toLowerCase().contains(query.toLowerCase())) ||
                    (user.getPhoneNumber() != null && user.getPhoneNumber().contains(query))
                )
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<User> getUserByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber);
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public boolean isUsernameAvailable(String username) {
        if (username == null || username.trim().isEmpty()) {
            return false;
        }
        return !userRepository.existsByUsername(username.trim());
    }

    @Override
    public void deleteUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // TODO: Implement soft delete or handle related data cleanup
        userRepository.delete(user);
    }

    @Override
    public UserDto createUserProfile(UserDto userDto) {
        User user = User.builder()
            .firstName(userDto.getFirstName())
            .lastName(userDto.getLastName())
            .otherName(userDto.getOtherName())
            .phoneNumber(userDto.getPhoneNumber())
            .profilePictureUrl(userDto.getProfilePictureUrl())
            .username(userDto.getUsername())
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    // Helper method to convert User entity to UserDto
    private UserDto convertToDto(User user) {
        return new UserDto(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getOtherName(),
            user.getPhoneNumber(),
            user.getProfilePictureUrl(),
            user.getUsername()
        );
    }

    // Additional helper methods
    public List<UserDto> getOnlineUsers() {
        return userRepository.findAll().stream()
                .filter(User::isOnline)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public void updateUserBio(Long userId, String bio) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setBio(bio);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public void updateUsername(Long userId, String newUsername) {
        if (!isUsernameAvailable(newUsername)) {
            throw new RuntimeException("Username is not available");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setUsername(newUsername);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }
} 
