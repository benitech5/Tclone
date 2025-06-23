package com.qwadwocodes.konvo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String bio;
    private String profilePictureUrl;
    private boolean isOnline;
    private java.time.LocalDateTime lastSeen;

    public UserDto(com.qwadwocodes.konvo.model.User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.phoneNumber = user.getPhoneNumber();
        this.bio = user.getBio();
        this.profilePictureUrl = user.getProfilePictureUrl();
        this.isOnline = user.isOnline();
        this.lastSeen = user.getLastSeen();
    }
} 