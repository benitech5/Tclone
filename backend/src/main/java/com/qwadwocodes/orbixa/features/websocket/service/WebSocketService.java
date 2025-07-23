package com.qwadwocodes.orbixa.features.websocket.service;

import com.qwadwocodes.orbixa.features.websocket.dto.*;

import java.util.Set;

public interface WebSocketService {

    // User session management
    void userConnected(String sessionId, Long userId);
    void userDisconnected(String sessionId, Long userId);
    Set<String> getUserSessionIds(Long userId);
    Long getUserIdFromSession(String sessionId);
    
    // Chat messaging
    void sendMessageToChat(Long chatId, ChatMessage message);
    void sendMessageToUser(Long userId, ChatMessage message);
    void sendTypingIndicator(Long chatId, Long userId, boolean isTyping);
    
    // Presence updates
    void broadcastPresenceUpdate(PresenceMessage presenceMessage);
    void sendPresenceUpdateToUser(Long userId, PresenceMessage presenceMessage);
    
    // Call signaling
    void sendCallSignal(Long userId, CallMessage callMessage);
    void sendCallSignalToChat(Long chatId, CallMessage callMessage);
    
    // Notifications
    void sendNotification(Long userId, NotificationMessage notification);
    void broadcastNotification(NotificationMessage notification);
    
    // General messaging
    void sendToUser(Long userId, WebSocketMessage<?> message);
    void sendToChat(Long chatId, WebSocketMessage<?> message);
    void broadcastToAll(WebSocketMessage<?> message);
    
    // Connection status
    boolean isUserOnline(Long userId);
    int getOnlineUserCount();
} 