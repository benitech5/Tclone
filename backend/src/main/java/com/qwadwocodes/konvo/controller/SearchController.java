package com.qwadwocodes.konvo.controller;

import com.qwadwocodes.konvo.dto.MessageDto;
import com.qwadwocodes.konvo.dto.UserDto;
import com.qwadwocodes.konvo.model.Channel;
import com.qwadwocodes.konvo.model.ChatGroup;
import com.qwadwocodes.konvo.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/messages")
    public ResponseEntity<Page<MessageDto>> searchAllMessages(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(searchService.searchAllMessages(query, pageable));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<Page<MessageDto>> searchMessagesInConversation(
            @PathVariable String conversationId,
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(searchService.searchMessagesInConversation(conversationId, query, pageable));
    }

    @GetMapping("/groups/{groupId}/messages")
    public ResponseEntity<Page<MessageDto>> searchMessagesInGroup(
            @PathVariable Long groupId,
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(searchService.searchMessagesInGroup(groupId, query, pageable));
    }

    @GetMapping("/channels/{channelId}/messages")
    public ResponseEntity<Page<MessageDto>> searchMessagesInChannel(
            @PathVariable Long channelId,
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(searchService.searchMessagesInChannel(channelId, query, pageable));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(searchService.searchUsers(query));
    }

    @GetMapping("/groups")
    public ResponseEntity<Page<ChatGroup>> searchGroups(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(searchService.searchGroups(query, pageable));
    }

    @GetMapping("/channels")
    public ResponseEntity<Page<Channel>> searchChannels(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(searchService.searchChannels(query, pageable));
    }
} 