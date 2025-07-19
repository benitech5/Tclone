package com.qwadwocodes.orbixa.features.search.service;

import com.qwadwocodes.orbixa.features.profile.dto.UserDto;
import com.qwadwocodes.orbixa.features.profile.model.User;
import com.qwadwocodes.orbixa.features.profile.repository.UserRepository;
import com.qwadwocodes.orbixa.features.chat.model.Chat;
import com.qwadwocodes.orbixa.features.chat.model.Message;
import com.qwadwocodes.orbixa.features.chat.repository.ChatRepository;
import com.qwadwocodes.orbixa.features.chat.repository.MessageRepository;
import com.qwadwocodes.orbixa.features.search.model.Search;
import com.qwadwocodes.orbixa.features.search.repository.SearchRepository;
import com.qwadwocodes.orbixa.features.contacts.service.ContactService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class SearchServiceImpl implements SearchService {

    private final UserRepository userRepository;
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final SearchRepository searchRepository;
    private final ContactService contactService;

    public SearchServiceImpl(UserRepository userRepository,
                           ChatRepository chatRepository,
                           MessageRepository messageRepository,
                           SearchRepository searchRepository,
                           ContactService contactService) {
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
        this.searchRepository = searchRepository;
        this.contactService = contactService;
    }

    @Override
    public List<UserDto> searchUsers(String query, Long currentUserId) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }

        String searchQuery = query.toLowerCase().trim();
        
        // Get all users and filter based on search criteria
        List<User> allUsers = userRepository.findAll();
        
        return allUsers.stream()
                .filter(user -> !user.getId().equals(currentUserId)) // Exclude current user
                .filter(user -> 
                    (user.getFirstName() != null && user.getFirstName().toLowerCase().contains(searchQuery)) ||
                    (user.getUsername() != null && user.getUsername().toLowerCase().contains(searchQuery)) ||
                    (user.getPhoneNumber() != null && user.getPhoneNumber().contains(searchQuery))
                )
                .map(this::convertToUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<Chat> searchChats(String query, Long currentUserId) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }

        String searchQuery = query.toLowerCase().trim();
        
        // Get all chats and filter based on search criteria
        List<Chat> allChats = chatRepository.findAll();
        
        return allChats.stream()
                .filter(chat -> 
                    (chat.getTitle() != null && chat.getTitle().toLowerCase().contains(searchQuery)) ||
                    (chat.getDescription() != null && chat.getDescription().toLowerCase().contains(searchQuery))
                )
                .collect(Collectors.toList());
    }

    @Override
    public List<Message> searchMessages(String query, Long currentUserId, Long chatId) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }

        String searchQuery = query.toLowerCase().trim();
        
        // Get all messages and filter based on search criteria
        List<Message> allMessages = messageRepository.findAll();
        
        return allMessages.stream()
                .filter(message -> 
                    message.getContent() != null && 
                    message.getContent().toLowerCase().contains(searchQuery) &&
                    message.getDeletedAt() == null // Exclude deleted messages
                )
                .filter(message -> chatId == null || 
                    (message.getGroup() != null && message.getGroup().getId().equals(chatId)))
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> globalSearch(String query, Long currentUserId) {
        if (query == null || query.trim().isEmpty()) {
            return Map.of();
        }

        Map<String, Object> results = new HashMap<>();
        
        // Search users
        List<UserDto> users = searchUsers(query, currentUserId);
        results.put("users", users);
        
        // Search chats
        List<Chat> chats = searchChats(query, currentUserId);
        results.put("chats", chats);
        
        // Search messages (global, not limited to specific chat)
        List<Message> messages = searchMessages(query, currentUserId, null);
        results.put("messages", messages);
        
        // Save search history
        saveSearchHistory(currentUserId, query, "global");
        
        return results;
    }

    @Override
    public void saveSearchHistory(Long userId, String query, String resultType) {
        Search search = new Search();
        search.setQuery(query);
        search.setResultType(resultType);
        search.setResult("Search performed at " + LocalDateTime.now());
        
        searchRepository.save(search);
    }

    @Override
    public List<Search> getSearchHistory(Long userId) {
        // TODO: Implement custom query in repository to filter by userId
        return searchRepository.findAll().stream()
                .limit(20) // Limit to last 20 searches
                .collect(Collectors.toList());
    }

    @Override
    public void clearSearchHistory(Long userId) {
        // TODO: Implement custom query in repository to delete by userId
        List<Search> userSearches = getSearchHistory(userId);
        searchRepository.deleteAll(userSearches);
    }

    @Override
    public List<String> getSearchSuggestions(String partialQuery) {
        if (partialQuery == null || partialQuery.trim().isEmpty()) {
            return List.of();
        }

        String query = partialQuery.toLowerCase().trim();
        List<String> suggestions = new ArrayList<>();
        
        // Get user suggestions
        List<User> users = userRepository.findAll();
        users.stream()
                .filter(user -> 
                    (user.getFirstName() != null && user.getFirstName().toLowerCase().contains(query)) ||
                    (user.getUsername() != null && user.getUsername().toLowerCase().contains(query))
                )
                .limit(5)
                .forEach(user -> {
                    if (user.getFirstName() != null) {
                        suggestions.add(user.getFirstName());
                    }
                    if (user.getUsername() != null) {
                        suggestions.add("@" + user.getUsername());
                    }
                });
        
        // Get chat suggestions
        List<Chat> chats = chatRepository.findAll();
        chats.stream()
                .filter(chat -> chat.getTitle() != null && chat.getTitle().toLowerCase().contains(query))
                .limit(3)
                .forEach(chat -> suggestions.add(chat.getTitle()));
        
        // Remove duplicates and limit results
        return suggestions.stream()
                .distinct()
                .limit(10)
                .collect(Collectors.toList());
    }

    // Helper method to convert User to UserDto
    private UserDto convertToUserDto(User user) {
        return new UserDto(
            user.getId(),
            user.getFirstName(),
            user.getPhoneNumber(),
            user.getProfilePictureUrl()
        );
    }

    // Additional helper methods
    public List<UserDto> searchContacts(String query, Long currentUserId) {
        List<UserDto> allUsers = searchUsers(query, currentUserId);
        return allUsers.stream()
                .filter(user -> contactService.isContact(currentUserId, user.getId()))
                .collect(Collectors.toList());
    }

    public List<UserDto> searchNonContacts(String query, Long currentUserId) {
        List<UserDto> allUsers = searchUsers(query, currentUserId);
        return allUsers.stream()
                .filter(user -> !contactService.isContact(currentUserId, user.getId()))
                .collect(Collectors.toList());
    }

    public Map<String, Integer> getSearchStats(Long userId) {
        Map<String, Integer> stats = new HashMap<>();
        
        List<Search> history = getSearchHistory(userId);
        stats.put("totalSearches", history.size());
        
        // Count by result type
        Map<String, Long> typeCounts = history.stream()
                .collect(Collectors.groupingBy(Search::getResultType, Collectors.counting()));
        
        typeCounts.forEach((type, count) -> stats.put(type + "Searches", count.intValue()));
        
        return stats;
    }
} 
