package com.qwadwocodes.orbixa.features.profile.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String otherName;
    private String phoneNumber;
    private String profilePictureUrl;
    private String username;

    public String getUsername() {
        return username;
    }
} 
