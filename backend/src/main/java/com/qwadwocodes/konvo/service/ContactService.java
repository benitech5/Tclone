package com.qwadwocodes.konvo.service;

import com.qwadwocodes.konvo.dto.UserDto;
import com.qwadwocodes.konvo.model.User;
import com.qwadwocodes.konvo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final UserRepository userRepository;

    @Transactional
    public List<UserDto> syncContacts(User currentUser, List<String> phoneNumbers) {
        // Find all registered users matching the phone numbers provided
        List<User> foundUsers = userRepository.findAllByPhoneNumberIn(phoneNumbers);

        // Add the found users to the current user's contact list
        // The Set will automatically handle duplicates
        currentUser.getContacts().addAll(foundUsers);

        // Remove the current user from their own contact list if they exist
        currentUser.getContacts().remove(currentUser);

        userRepository.save(currentUser);

        // Return the newly added contacts as DTOs
        return foundUsers.stream()
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserDto> getContacts(User currentUser) {
        // We need to fetch the user again within a transaction to get lazy-loaded contacts
        User userWithContacts = userRepository.findById(currentUser.getId()).orElseThrow();
        return userWithContacts.getContacts().stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserDto> searchUsers(String query) {
        return userRepository.searchUsers(query)
                .stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }
} 