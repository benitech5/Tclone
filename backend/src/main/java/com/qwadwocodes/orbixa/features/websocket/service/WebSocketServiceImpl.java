package com.qwadwocodes.orbixa.features.websocket.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qwadwocodes.orbixa.features.websocket.dto.*;
import com.qwadwocodes.orbixa.features.other.service.MockRedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Set;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketServiceImpl implements WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final SimpUserRegistry userRegistry;
    private final MockRedisService mockRedisService;
    private final ObjectMapper objectMapper;

    // In-memory session mapping (for faster lookups)
    private final Map<String, Long> sessionToUser = new ConcurrentHashMap<>();
    private final Map<Long, Set<String>> userToSessions = new ConcurrentHashMap<>();

    private static final String USER_SESSION_KEY = "websocket:user_session:";
    private static final String SESSION_USER_KEY = "websocket:session_user:";
    private static final String ONLINE_USERS_KEY = "websocket:online_users";

    @Override
    public void userConnected(String sessionId, Long userId) {
        try {
            // Store in memory for fast access
            sessionToUser.put(sessionId, userId);
            userToSessions.computeIfAbsent(userId, k -> new HashSet<>()).add(sessionId);
            
            // Store in mock Redis for persistence (optional: update to support sets)
            mockRedisService.set(USER_SESSION_KEY + userId, sessionId, Duration.ofHours(24));
            mockRedisService.set(SESSION_USER_KEY + sessionId, userId.toString(), Duration.ofHours(24));
            mockRedisService.addToSet(ONLINE_USERS_KEY, userId.toString());
            
            log.info("User {} connected with session {}", userId, sessionId);
            
            // Broadcast presence update
            PresenceMessage presenceMessage = new PresenceMessage();
            presenceMessage.setUserId(userId);
            presenceMessage.setStatus("ONLINE");
            presenceMessage.setTimestamp(java.time.LocalDateTime.now());
            broadcastPresenceUpdate(presenceMessage);
            
        } catch (Exception e) {
            log.error("Error handling user connection: {}", e.getMessage(), e);
        }
    }

    @Override
    public void userDisconnected(String sessionId, Long userId) {
        try {
            // Remove from memory
            sessionToUser.remove(sessionId);
            Set<String> sessions = userToSessions.get(userId);
            if (sessions != null) {
                sessions.remove(sessionId);
                if (sessions.isEmpty()) {
                    userToSessions.remove(userId);
                }
            }
            
            // Remove from mock Redis
            mockRedisService.delete(USER_SESSION_KEY + userId);
            mockRedisService.delete(SESSION_USER_KEY + sessionId);
            mockRedisService.removeFromSet(ONLINE_USERS_KEY, userId.toString());
            
            log.info("User {} disconnected from session {}", userId, sessionId);
            
            // Broadcast presence update
            PresenceMessage presenceMessage = new PresenceMessage();
            presenceMessage.setUserId(userId);
            presenceMessage.setStatus("OFFLINE");
            presenceMessage.setTimestamp(java.time.LocalDateTime.now());
            broadcastPresenceUpdate(presenceMessage);
            
        } catch (Exception e) {
            log.error("Error handling user disconnection: {}", e.getMessage(), e);
        }
    }

    @Override
    public Set<String> getUserSessionIds(Long userId) {
        // Check memory first
        Set<String> sessions = userToSessions.get(userId);
        if (sessions != null && !sessions.isEmpty()) {
            return sessions;
        }
        // Fallback to mock Redis (not implemented for sets)
        return new HashSet<>();
    }

    @Override
    public Long getUserIdFromSession(String sessionId) {
        // Check memory first
        Long userId = sessionToUser.get(sessionId);
        if (userId != null) {
            return userId;
        }
        
        // Fallback to mock Redis
        String userIdStr = mockRedisService.get(SESSION_USER_KEY + sessionId);
        return userIdStr != null ? Long.parseLong(userIdStr) : null;
    }

    @Override
    public void sendMessageToChat(Long chatId, ChatMessage message) {
        try {
            WebSocketMessage<ChatMessage> wsMessage = new WebSocketMessage<>("CHAT_MESSAGE", message);
            String destination = "/topic/chat/" + chatId;
            messagingTemplate.convertAndSend(destination, wsMessage);
            log.debug("Sent message to chat {}: {}", chatId, message.getMessageId());
        } catch (Exception e) {
            log.error("Error sending message to chat {}: {}", chatId, e.getMessage(), e);
        }
    }

    @Override
    public void sendMessageToUser(Long userId, ChatMessage message) {
        try {
            WebSocketMessage<ChatMessage> wsMessage = new WebSocketMessage<>("CHAT_MESSAGE", message);
            Set<String> sessions = getUserSessionIds(userId);
            for (String sessionId : sessions) {
                messagingTemplate.convertAndSendToUser(sessionId, "/queue/messages", wsMessage);
            }
            log.debug("Sent message to all sessions of user {}: {}", userId, message.getMessageId());
        } catch (Exception e) {
            log.error("Error sending message to user {}: {}", userId, e.getMessage(), e);
        }
    }

    @Override
    public void sendTypingIndicator(Long chatId, Long userId, boolean isTyping) {
        try {
            PresenceMessage typingMessage = new PresenceMessage();
            typingMessage.setUserId(userId);
            typingMessage.setTypingInChatId(isTyping ? chatId : null);
            typingMessage.setIsTyping(isTyping);
            typingMessage.setTimestamp(java.time.LocalDateTime.now());
            
            WebSocketMessage<PresenceMessage> wsMessage = new WebSocketMessage<>("TYPING_INDICATOR", typingMessage);
            String destination = "/topic/chat/" + chatId + "/typing";
            messagingTemplate.convertAndSend(destination, wsMessage);
            log.debug("Sent typing indicator to chat {}: user {} is typing: {}", chatId, userId, isTyping);
        } catch (Exception e) {
            log.error("Error sending typing indicator: {}", e.getMessage(), e);
        }
    }

    @Override
    public void broadcastPresenceUpdate(PresenceMessage presenceMessage) {
        try {
            WebSocketMessage<PresenceMessage> wsMessage = new WebSocketMessage<>("PRESENCE_UPDATE", presenceMessage);
            messagingTemplate.convertAndSend("/topic/presence", wsMessage);
            log.debug("Broadcasted presence update for user: {}", presenceMessage.getUserId());
        } catch (Exception e) {
            log.error("Error broadcasting presence update: {}", e.getMessage(), e);
        }
    }

    @Override
    public void sendPresenceUpdateToUser(Long userId, PresenceMessage presenceMessage) {
        try {
            WebSocketMessage<PresenceMessage> wsMessage = new WebSocketMessage<>("PRESENCE_UPDATE", presenceMessage);
            Set<String> sessions = getUserSessionIds(userId);
            for (String sessionId : sessions) {
                messagingTemplate.convertAndSendToUser(sessionId, "/queue/presence", wsMessage);
            }
            log.debug("Sent presence update to all sessions of user: {}", userId);
        } catch (Exception e) {
            log.error("Error sending presence update to user {}: {}", userId, e.getMessage(), e);
        }
    }

    @Override
    public void sendCallSignal(Long userId, CallMessage callMessage) {
        try {
            WebSocketMessage<CallMessage> wsMessage = new WebSocketMessage<>("CALL_SIGNAL", callMessage);
            Set<String> sessions = getUserSessionIds(userId);
            for (String sessionId : sessions) {
                messagingTemplate.convertAndSendToUser(sessionId, "/queue/calls", wsMessage);
            }
            log.debug("Sent call signal to all sessions of user: {}", userId);
        } catch (Exception e) {
            log.error("Error sending call signal to user {}: {}", userId, e.getMessage(), e);
        }
    }

    @Override
    public void sendCallSignalToChat(Long chatId, CallMessage callMessage) {
        try {
            WebSocketMessage<CallMessage> wsMessage = new WebSocketMessage<>("CALL_SIGNAL", callMessage);
            String destination = "/topic/chat/" + chatId + "/calls";
            messagingTemplate.convertAndSend(destination, wsMessage);
            log.debug("Sent call signal to chat: {}", chatId);
        } catch (Exception e) {
            log.error("Error sending call signal to chat {}: {}", chatId, e.getMessage(), e);
        }
    }

    @Override
    public void sendNotification(Long userId, NotificationMessage notification) {
        try {
            WebSocketMessage<NotificationMessage> wsMessage = new WebSocketMessage<>("NOTIFICATION", notification);
            Set<String> sessions = getUserSessionIds(userId);
            for (String sessionId : sessions) {
                messagingTemplate.convertAndSendToUser(sessionId, "/queue/notifications", wsMessage);
            }
            log.debug("Sent notification to all sessions of user: {}", userId);
        } catch (Exception e) {
            log.error("Error sending notification to user {}: {}", userId, e.getMessage(), e);
        }
    }

    @Override
    public void broadcastNotification(NotificationMessage notification) {
        try {
            WebSocketMessage<NotificationMessage> wsMessage = new WebSocketMessage<>("NOTIFICATION", notification);
            messagingTemplate.convertAndSend("/topic/notifications", wsMessage);
            log.debug("Broadcasted notification");
        } catch (Exception e) {
            log.error("Error broadcasting notification: {}", e.getMessage(), e);
        }
    }

    @Override
    public void sendToUser(Long userId, WebSocketMessage<?> message) {
        try {
            Set<String> sessions = getUserSessionIds(userId);
            for (String sessionId : sessions) {
                messagingTemplate.convertAndSendToUser(sessionId, "/queue/messages", message);
            }
            log.debug("Sent message to all sessions of user: {}", userId);
        } catch (Exception e) {
            log.error("Error sending message to user {}: {}", userId, e.getMessage(), e);
        }
    }

    @Override
    public void sendToChat(Long chatId, WebSocketMessage<?> message) {
        try {
            String destination = "/topic/chat/" + chatId;
            messagingTemplate.convertAndSend(destination, message);
            log.debug("Sent message to chat: {}", chatId);
        } catch (Exception e) {
            log.error("Error sending message to chat {}: {}", chatId, e.getMessage(), e);
        }
    }

    @Override
    public void broadcastToAll(WebSocketMessage<?> message) {
        try {
            messagingTemplate.convertAndSend("/topic/broadcast", message);
            log.debug("Broadcasted message to all users");
        } catch (Exception e) {
            log.error("Error broadcasting message: {}", e.getMessage(), e);
        }
    }

    @Override
    public boolean isUserOnline(Long userId) {
        return userToSessions.containsKey(userId) || 
               mockRedisService.isMember(ONLINE_USERS_KEY, userId.toString());
    }

    @Override
    public int getOnlineUserCount() {
        Long count = mockRedisService.setSize(ONLINE_USERS_KEY);
        return count != null ? count.intValue() : 0;
    }
} 