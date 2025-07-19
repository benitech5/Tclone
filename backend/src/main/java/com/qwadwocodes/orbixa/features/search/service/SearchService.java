package com.qwadwocodes.orbixa.features.search.service;

import com.qwadwocodes.orbixa.features.profile.dto.UserDto;
import com.qwadwocodes.orbixa.features.chat.model.Chat;
import com.qwadwocodes.orbixa.features.chat.model.Message;
import com.qwadwocodes.orbixa.features.search.model.Search;

import java.util.List;
import java.util.Map;

public interface SearchService {
    List<UserDto> searchUsers(String query, Long currentUserId);
    List<UserDto> searchContacts(String query, Long currentUserId);
    List<UserDto> searchNonContacts(String query, Long currentUserId);
    List<Chat> searchChats(String query, Long currentUserId);
    List<Message> searchMessages(String query, Long currentUserId, Long chatId);
    Map<String, Object> globalSearch(String query, Long currentUserId);
    void saveSearchHistory(Long userId, String query, String resultType);
    List<Search> getSearchHistory(Long userId);
    void clearSearchHistory(Long userId);
    List<String> getSearchSuggestions(String partialQuery);
    Map<String, Integer> getSearchStats(Long userId);
} 
