package com.qwadwocodes.orbixa.features.profile.service;

import com.qwadwocodes.orbixa.features.profile.dto.UserDto;
import com.qwadwocodes.orbixa.features.profile.model.User;

import java.util.List;
import java.util.Optional;

public interface ProfileService {
    UserDto getUserProfile(Long userId);
    UserDto updateUserProfile(Long userId, UserDto userDto);
    void updateProfilePicture(Long userId, String pictureUrl);
    void updateUserStatus(Long userId, boolean isOnline);
    void updateLastSeen(Long userId);
    List<UserDto> searchUsers(String query);
    Optional<User> getUserByPhoneNumber(String phoneNumber);
    Optional<User> getUserByUsername(String username);
    boolean isUsernameAvailable(String username);
    void deleteUserProfile(Long userId);
    List<UserDto> getOnlineUsers();
    void updateUserBio(Long userId, String bio);
    void updateUsername(Long userId, String newUsername);
} 
