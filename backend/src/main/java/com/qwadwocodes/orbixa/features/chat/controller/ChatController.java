package com.qwadwocodes.orbixa.features.chat.controller;

import com.qwadwocodes.orbixa.features.chat.model.Chat;
import com.qwadwocodes.orbixa.features.chat.model.ChatMember;
import com.qwadwocodes.orbixa.features.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {
    
    private final ChatService chatService;

    @GetMapping
    public ResponseEntity<List<Chat>> getChats() {
        List<Chat> chats = chatService.getChats();
        return ResponseEntity.ok(chats);
    }

    @PostMapping
    public ResponseEntity<Chat> createChat(@RequestBody Chat chat) {
        System.out.println("=== CREATE CHAT DEBUG ===");
        System.out.println("Received chat: " + chat);
        System.out.println("Chat title: " + chat.getTitle());
        System.out.println("Chat description: " + chat.getDescription());
        System.out.println("Chat type: " + chat.getType());
        System.out.println("========================");
        
        try {
            chatService.createChat(chat);
            return ResponseEntity.ok(chat);
        } catch (Exception e) {
            System.out.println("Error creating chat: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<Chat> getChat(@PathVariable Long chatId) {
        Chat chat = chatService.getChat(chatId);
        return ResponseEntity.ok(chat);
    }

    @PutMapping("/{chatId}")
    public ResponseEntity<Void> updateChat(@PathVariable Long chatId, @RequestBody Chat chat) {
        chatService.updateChat(chatId, chat);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{chatId}")
    public ResponseEntity<Void> deleteChat(@PathVariable Long chatId) {
        chatService.deleteChat(chatId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Chat>> getChatsForUser(@PathVariable Long userId) {
        List<Chat> chats = chatService.getChatsForUser(userId);
        return ResponseEntity.ok(chats);
    }

    @PostMapping("/{chatId}/members")
    public ResponseEntity<Void> addMemberToChat(
            @PathVariable Long chatId,
            @RequestParam Long userId,
            @RequestParam(defaultValue = "MEMBER") String role) {
        
        ChatMember.Role memberRole = ChatMember.Role.valueOf(role.toUpperCase());
        chatService.addMemberToChat(chatId, userId, memberRole);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{chatId}/members/{userId}")
    public ResponseEntity<Void> removeMemberFromChat(
            @PathVariable Long chatId,
            @PathVariable Long userId) {
        
        chatService.removeMemberFromChat(chatId, userId);
        return ResponseEntity.ok().build();
    }
} 
