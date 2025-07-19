package com.qwadwocodes.orbixa.features.chat.controller;

import com.qwadwocodes.orbixa.features.chat.model.Message;
import com.qwadwocodes.orbixa.features.chat.service.MessageService;
import com.qwadwocodes.orbixa.features.profile.model.User;
import com.qwadwocodes.orbixa.features.profile.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {
    
    private final MessageService messageService;
    private final UserRepository userRepository;

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long chatId) {
        List<Message> messages = messageService.getMessages(chatId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/chat/{chatId}")
    public ResponseEntity<Void> sendMessage(@PathVariable Long chatId, @RequestBody Message message) {
        System.out.println("=== SEND MESSAGE DEBUG ===");
        System.out.println("Chat ID: " + chatId);
        System.out.println("Message content: " + message.getContent());
        System.out.println("Message type: " + message.getMessageType());
        
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String phoneNumber = authentication.getName();
            System.out.println("Authenticated user phone: " + phoneNumber);
            
            // Find the user by phone number
            User user = userRepository.findByPhoneNumber(phoneNumber)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            System.out.println("Found user: " + user.getFirstName() + " (ID: " + user.getId() + ")");
            
            // Set the sender
            message.setSender(user);
            
            // Send the message
            messageService.sendMessage(chatId, message);
            System.out.println("Message sent successfully");
            System.out.println("=========================");
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("Error sending message: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PutMapping("/{messageId}")
    public ResponseEntity<Void> editMessage(@PathVariable Long messageId, @RequestBody Message message) {
        messageService.editMessage(messageId, message);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long messageId) {
        messageService.deleteMessage(messageId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{messageId}/reply")
    public ResponseEntity<Void> replyToMessage(@PathVariable Long messageId, @RequestBody Message reply) {
        messageService.replyToMessage(messageId, reply);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{messageId}/react")
    public ResponseEntity<Void> reactToMessage(@PathVariable Long messageId, @RequestParam String reaction) {
        messageService.reactToMessage(messageId, reaction);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Message>> getMessagesByUser(@PathVariable Long userId) {
        List<Message> messages = messageService.getMessagesByUser(userId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/user/{userId}/saved")
    public ResponseEntity<List<Message>> getSavedMessages(@PathVariable Long userId) {
        List<Message> messages = messageService.getSavedMessages(userId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/user/{userId}/pinned")
    public ResponseEntity<List<Message>> getPinnedMessages(@PathVariable Long userId) {
        List<Message> messages = messageService.getPinnedMessages(userId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{messageId}/save")
    public ResponseEntity<Void> saveMessage(@PathVariable Long messageId, @RequestParam Long userId) {
        messageService.saveMessage(messageId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{messageId}/pin")
    public ResponseEntity<Void> pinMessage(@PathVariable Long messageId, @RequestParam Long userId) {
        messageService.pinMessage(messageId, userId);
        return ResponseEntity.ok().build();
    }
} 
