package com.qwadwocodes.orbixa.features.other.controller;

import com.qwadwocodes.orbixa.features.other.dto.PresenceDto;
import com.qwadwocodes.orbixa.features.other.service.PresenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/presence")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PresenceController {

    private final PresenceService presenceService;

    @GetMapping("/user/{userId}/status")
    public ResponseEntity<String> getUserStatus(@PathVariable Long userId) {
        String status = presenceService.getUserStatus(userId);
        return ResponseEntity.ok(status);
    }

    @PutMapping("/user/{userId}/status")
    public ResponseEntity<Void> setUserStatus(
            @PathVariable Long userId,
            @RequestParam String status) {
        
        presenceService.setUserStatus(userId, status);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{userId}/online")
    public ResponseEntity<Void> setUserOnline(@PathVariable Long userId) {
        presenceService.setUserOnline(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{userId}/offline")
    public ResponseEntity<Void> setUserOffline(@PathVariable Long userId) {
        presenceService.setUserOffline(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{userId}/away")
    public ResponseEntity<Void> setUserAway(@PathVariable Long userId) {
        presenceService.setUserAway(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{userId}/busy")
    public ResponseEntity<Void> setUserBusy(@PathVariable Long userId) {
        presenceService.setUserBusy(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{userId}/invisible")
    public ResponseEntity<Void> setUserInvisible(@PathVariable Long userId) {
        presenceService.setUserInvisible(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{userId}/typing")
    public ResponseEntity<Void> setTyping(
            @PathVariable Long userId,
            @RequestParam boolean typing) {
        
        presenceService.setTyping(userId, typing);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{userId}/typing/chat/{chatId}")
    public ResponseEntity<Void> setTypingInChat(
            @PathVariable Long userId,
            @PathVariable Long chatId,
            @RequestParam boolean typing) {
        
        presenceService.setTypingInChat(userId, chatId, typing);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}/typing")
    public ResponseEntity<Boolean> isUserTyping(@PathVariable Long userId) {
        boolean typing = presenceService.isUserTyping(userId);
        return ResponseEntity.ok(typing);
    }

    @GetMapping("/user/{userId}/typing/chat/{chatId}")
    public ResponseEntity<Boolean> isUserTypingInChat(
            @PathVariable Long userId,
            @PathVariable Long chatId) {
        
        boolean typing = presenceService.isUserTypingInChat(userId, chatId);
        return ResponseEntity.ok(typing);
    }

    @GetMapping("/chat/{chatId}/typing")
    public ResponseEntity<List<Long>> getTypingUsersInChat(@PathVariable Long chatId) {
        List<Long> typingUsers = presenceService.getTypingUsersInChat(chatId);
        return ResponseEntity.ok(typingUsers);
    }

    @GetMapping("/users/status")
    public ResponseEntity<Map<Long, String>> getUsersStatus(@RequestBody List<Long> userIds) {
        Map<Long, String> statusMap = presenceService.getUsersStatus(userIds);
        return ResponseEntity.ok(statusMap);
    }

    @PutMapping("/user/{userId}/last-seen")
    public ResponseEntity<Void> updateLastSeen(@PathVariable Long userId) {
        presenceService.updateLastSeen(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}/info")
    public ResponseEntity<PresenceDto> getPresenceInfo(@PathVariable Long userId) {
        PresenceDto presenceInfo = presenceService.getPresenceInfo(userId);
        return ResponseEntity.ok(presenceInfo);
    }

    @GetMapping("/online-users")
    public ResponseEntity<List<Long>> getOnlineUsers() {
        List<Long> onlineUsers = presenceService.getOnlineUsers();
        return ResponseEntity.ok(onlineUsers);
    }

    @DeleteMapping("/user/{userId}/clear")
    public ResponseEntity<Void> clearUserPresence(@PathVariable Long userId) {
        presenceService.clearUserPresence(userId);
        return ResponseEntity.ok().build();
    }
} 
