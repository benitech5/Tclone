package com.qwadwocodes.konvo.controller;

import com.qwadwocodes.konvo.dto.*;
import com.qwadwocodes.konvo.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<MessageDto> sendMessage(@RequestBody SendMessageDto sendMessageDto, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatService.sendMessage(sendMessageDto, userDetails));
    }

    @GetMapping("/{groupId}/messages")
    public ResponseEntity<List<MessageDto>> getMessages(@PathVariable Long groupId, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatService.getMessages(groupId, userDetails));
    }

    @GetMapping("/groups")
    public ResponseEntity<List<GroupDto>> getUserGroups(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatService.getUserGroups(userDetails));
    }

    @PostMapping("/groups")
    public ResponseEntity<GroupDto> createGroup(@RequestBody CreateGroupDto createGroupDto, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatService.createGroup(createGroupDto, userDetails));
    }

    @GetMapping("/saved")
    public ResponseEntity<List<MessageDto>> getSavedMessages(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatService.getSavedMessages(userDetails));
    }

    @PostMapping("/saved/{messageId}")
    public ResponseEntity<Void> saveMessage(@PathVariable Long messageId, @AuthenticationPrincipal UserDetails userDetails) {
        chatService.saveMessage(messageId, userDetails);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/saved/{messageId}")
    public ResponseEntity<Void> unsaveMessage(@PathVariable Long messageId, @AuthenticationPrincipal UserDetails userDetails) {
        chatService.unsaveMessage(messageId, userDetails);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pinned/{groupId}")
    public ResponseEntity<List<MessageDto>> getPinnedMessages(@PathVariable Long groupId, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatService.getPinnedMessages(groupId, userDetails));
    }

    @PostMapping("/pinned/{messageId}")
    public ResponseEntity<Void> pinMessage(@PathVariable Long messageId, @AuthenticationPrincipal UserDetails userDetails) {
        chatService.pinMessage(messageId, userDetails);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/pinned/{messageId}")
    public ResponseEntity<Void> unpinMessage(@PathVariable Long messageId, @AuthenticationPrincipal UserDetails userDetails) {
        chatService.unpinMessage(messageId, userDetails);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/media/{groupId}")
    public ResponseEntity<List<MessageDto>> getMediaShared(@PathVariable Long groupId, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatService.getMediaShared(groupId, userDetails));
    }

    @PostMapping("/forward")
    public ResponseEntity<Void> forwardMessage(@RequestBody ForwardMessageDto forwardMessageDto, @AuthenticationPrincipal UserDetails userDetails) {
        chatService.forwardMessage(forwardMessageDto, userDetails);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/settings/{groupId}")
    public ResponseEntity<ChatSettingsDto> getChatSettings(@PathVariable Long groupId, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatService.getChatSettings(groupId, userDetails));
    }

    @PutMapping("/settings/{groupId}")
    public ResponseEntity<Void> updateChatSettings(@PathVariable Long groupId, @RequestBody ChatSettingsDto chatSettingsDto, @AuthenticationPrincipal UserDetails userDetails) {
        chatService.updateChatSettings(groupId, chatSettingsDto, userDetails);
        return ResponseEntity.ok().build();
    }
} 