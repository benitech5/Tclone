package com.qwadwocodes.orbixa.features.other.service;

import com.qwadwocodes.orbixa.features.other.dto.PresenceDto;
import java.util.List;
import java.util.Map;

public interface PresenceService {
    String getUserStatus(Long userId);
    void setUserStatus(Long userId, String status);
    void setTyping(Long userId, boolean typing);
    void setTypingInChat(Long userId, Long chatId, boolean typing);
    boolean isUserTyping(Long userId);
    boolean isUserTypingInChat(Long userId, Long chatId);
    List<Long> getTypingUsersInChat(Long chatId);
    Map<Long, String> getUsersStatus(List<Long> userIds);
    void updateLastSeen(Long userId);
    void setUserOnline(Long userId);
    void setUserOffline(Long userId);
    void setUserAway(Long userId);
    void setUserBusy(Long userId);
    void setUserInvisible(Long userId);
    PresenceDto getPresenceInfo(Long userId);
    List<Long> getOnlineUsers();
    void clearUserPresence(Long userId);
} 
