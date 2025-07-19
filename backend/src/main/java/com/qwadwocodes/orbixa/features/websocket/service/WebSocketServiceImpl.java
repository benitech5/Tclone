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
    private final Map<Long, String> userToSession = new ConcurrentHashMap<>();

    private static final String USER_SESSION_KEY = "websocket:user_session:";
    private static final String SESSION_USER_KEY = "websocket:session_user:";
    private static final String ONLINE_USERS_KEY = "websocket:online_users";

    @Override
    public void userConnected(String sessionId, Long userId) {
        try {
            // Store in memory for fast access
            sessionToUser.put(sessionId, userId);
            userToSession.put(userId, sessionId);
            
            // Store in mock Redis for persistence
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
            userToSession.remove(userId);
            
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
    public String getUserSessionId(Long userId) {
        // Check memory first
        String sessionId = userToSession.get(userId);
        if (sessionId != null) {
            return sessionId;
        }
        
        // Fallback to mock Redis
        return mockRedisService.get(USER_SESSION_KEY + userId);
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
            String destination = "/user/" + userId + "/queue/messages";
            messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/messages", wsMessage);
            log.debug("Sent message to user {}: {}", userId, message.getMessageId());
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
            messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/presence", wsMessage);
            log.debug("Sent presence update to user: {}", userId);
        } catch (Exception e) {
            log.error("Error sending presence update to user {}: {}", userId, e.getMessage(), e);
        }
    }

    @Override
    public void sendCallSignal(Long userId, CallMessage callMessage) {
        try {
            WebSocketMessage<CallMessage> wsMessage = new WebSocketMessage<>("CALL_SIGNAL", callMessage);
            messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/calls", wsMessage);
            log.debug("Sent call signal to user: {}", userId);
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
            messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/notifications", wsMessage);
            log.debug("Sent notification to user: {}", userId);
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
            messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/messages", message);
            log.debug("Sent message to user: {}", userId);
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
        return userToSession.containsKey(userId) || 
               mockRedisService.isMember(ONLINE_USERS_KEY, userId.toString());
    }

    @Override
    public int getOnlineUserCount() {
        Long count = mockRedisService.setSize(ONLINE_USERS_KEY);
        return count != null ? count.intValue() : 0;
    }
} 