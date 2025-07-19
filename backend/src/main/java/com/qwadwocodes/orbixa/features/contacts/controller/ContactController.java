package com.qwadwocodes.orbixa.features.contacts.controller;

import com.qwadwocodes.orbixa.features.contacts.model.Contact;
import com.qwadwocodes.orbixa.features.contacts.service.ContactService;
import com.qwadwocodes.orbixa.features.profile.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContactController {
    
    private final ContactService contactService;

    @GetMapping
    public ResponseEntity<List<Contact>> getContacts() {
        List<Contact> contacts = contactService.getContacts();
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/user/{ownerId}")
    public ResponseEntity<List<Contact>> getContactsByOwner(@PathVariable Long ownerId) {
        List<Contact> contacts = contactService.getContactsByOwner(ownerId);
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/user/{ownerId}/users")
    public ResponseEntity<List<User>> getContactUsers(@PathVariable Long ownerId) {
        List<User> users = contactService.getContactUsers(ownerId);
        return ResponseEntity.ok(users);
    }

    @PostMapping
    public ResponseEntity<Void> addContact(@RequestBody Contact contact) {
        contactService.addContact(contact);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{ownerId}/{contactId}")
    public ResponseEntity<Void> removeContact(
            @PathVariable Long ownerId,
            @PathVariable Long contactId) {
        
        contactService.removeContact(ownerId, contactId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{ownerId}/{contactId}/alias")
    public ResponseEntity<Void> updateContactAlias(
            @PathVariable Long ownerId,
            @PathVariable Long contactId,
            @RequestParam String newAlias) {
        
        contactService.updateContactAlias(ownerId, contactId, newAlias);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{ownerId}/{contactId}/is-contact")
    public ResponseEntity<Boolean> isContact(
            @PathVariable Long ownerId,
            @PathVariable Long contactId) {
        
        boolean isContact = contactService.isContact(ownerId, contactId);
        return ResponseEntity.ok(isContact);
    }
} 
