package com.qwadwocodes.orbixa.features.search.controller;

import com.qwadwocodes.orbixa.features.profile.dto.UserDto;
import com.qwadwocodes.orbixa.features.chat.model.Chat;
import com.qwadwocodes.orbixa.features.chat.model.Message;
import com.qwadwocodes.orbixa.features.search.model.Search;
import com.qwadwocodes.orbixa.features.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SearchController {
    
    private final SearchService searchService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> searchUsers(
            @RequestParam String query,
            @RequestParam Long currentUserId) {
        
        List<UserDto> users = searchService.searchUsers(query, currentUserId);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/contacts")
    public ResponseEntity<List<UserDto>> searchContacts(
            @RequestParam String query,
            @RequestParam Long currentUserId) {
        
        List<UserDto> users = searchService.searchContacts(query, currentUserId);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/non-contacts")
    public ResponseEntity<List<UserDto>> searchNonContacts(
            @RequestParam String query,
            @RequestParam Long currentUserId) {
        
        List<UserDto> users = searchService.searchNonContacts(query, currentUserId);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/chats")
    public ResponseEntity<List<Chat>> searchChats(
            @RequestParam String query,
            @RequestParam Long currentUserId) {
        
        List<Chat> chats = searchService.searchChats(query, currentUserId);
        return ResponseEntity.ok(chats);
    }

    @GetMapping("/messages")
    public ResponseEntity<List<Message>> searchMessages(
            @RequestParam String query,
            @RequestParam Long currentUserId,
            @RequestParam(required = false) Long chatId) {
        
        List<Message> messages = searchService.searchMessages(query, currentUserId, chatId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/global")
    public ResponseEntity<Map<String, Object>> globalSearch(
            @RequestParam String query,
            @RequestParam Long currentUserId) {
        
        Map<String, Object> results = searchService.globalSearch(query, currentUserId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSearchSuggestions(@RequestParam String partialQuery) {
        List<String> suggestions = searchService.getSearchSuggestions(partialQuery);
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping("/history/user/{userId}")
    public ResponseEntity<List<Search>> getSearchHistory(@PathVariable Long userId) {
        List<Search> history = searchService.getSearchHistory(userId);
        return ResponseEntity.ok(history);
    }

    @DeleteMapping("/history/user/{userId}")
    public ResponseEntity<Void> clearSearchHistory(@PathVariable Long userId) {
        searchService.clearSearchHistory(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats/user/{userId}")
    public ResponseEntity<Map<String, Integer>> getSearchStats(@PathVariable Long userId) {
        Map<String, Integer> stats = searchService.getSearchStats(userId);
        return ResponseEntity.ok(stats);
    }
} 
