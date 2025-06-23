package com.qwadwocodes.konvo.controller;

import com.qwadwocodes.konvo.dto.SyncContactsRequest;
import com.qwadwocodes.konvo.dto.UserDto;
import com.qwadwocodes.konvo.model.User;
import com.qwadwocodes.konvo.repository.UserRepository;
import com.qwadwocodes.konvo.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String phoneNumber = auth.getName();
        return userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @PostMapping("/contacts/sync")
    public ResponseEntity<List<UserDto>> syncContacts(@RequestBody SyncContactsRequest request) {
        User currentUser = getCurrentUser();
        List<UserDto> syncedContacts = contactService.syncContacts(currentUser, request.getPhoneNumbers());
        return ResponseEntity.ok(syncedContacts);
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<UserDto>> getContacts() {
        User currentUser = getCurrentUser();
        List<UserDto> contacts = contactService.getContacts(currentUser);
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/users/search")
    public ResponseEntity<List<UserDto>> searchUsers(@RequestParam("query") String query) {
        List<UserDto> users = contactService.searchUsers(query);
        return ResponseEntity.ok(users);
    }
} 