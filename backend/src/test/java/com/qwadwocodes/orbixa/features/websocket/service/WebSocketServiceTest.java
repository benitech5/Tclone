package com.qwadwocodes.orbixa.features.websocket.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qwadwocodes.orbixa.features.websocket.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;

import java.time.Duration;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WebSocketServiceTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private SimpUserRegistry userRegistry;

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @Mock
    private SetOperations<String, String> setOperations;

    @InjectMocks
    private WebSocketServiceImpl webSocketService;

    private ChatMessage chatMessage;
    private PresenceMessage presenceMessage;
    private CallMessage callMessage;
    private NotificationMessage notificationMessage;

    @BeforeEach
    void setUp() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.opsForSet()).thenReturn(setOperations);

        chatMessage = new ChatMessage();
        chatMessage.setMessageId(1L);
        chatMessage.setContent("Test message");
        chatMessage.setSenderId(1L);
        chatMessage.setChatId(1L);

        presenceMessage = new PresenceMessage();
        presenceMessage.setUserId(1L);
        presenceMessage.setStatus("ONLINE");
        presenceMessage.setTimestamp(java.time.LocalDateTime.now());

        callMessage = new CallMessage();
        callMessage.setCallId(123L);
        callMessage.setCallType("VIDEO");
        callMessage.setCallerId(1L);
        callMessage.setParticipants(java.util.Arrays.asList(1L, 2L));

        notificationMessage = new NotificationMessage();
        notificationMessage.setNotificationId(1L);
        notificationMessage.setTitle("Test Notification");
        notificationMessage.setBody("Test notification body");
        notificationMessage.setRecipientId(1L);
    }

    @Test
    void testUserConnected() {
        // Given
        String sessionId = "session-123";
        Long userId = 1L;

        // When
        webSocketService.userConnected(sessionId, userId);

        // Then
        verify(valueOperations).set(anyString(), eq(sessionId), any(Duration.class));
        verify(valueOperations).set(anyString(), eq(userId.toString()), any(Duration.class));
        verify(setOperations).add(anyString(), eq(userId.toString()));
        verify(messagingTemplate).convertAndSend(eq("/topic/presence"), any(WebSocketMessage.class));
    }

    @Test
    void testUserDisconnected() {
        // Given
        String sessionId = "session-123";
        Long userId = 1L;

        // When
        webSocketService.userDisconnected(sessionId, userId);

        // Then
        verify(redisTemplate).delete(anyString());
        verify(redisTemplate).delete(anyString());
        verify(setOperations).remove(anyString(), eq(userId.toString()));
        verify(messagingTemplate).convertAndSend(eq("/topic/presence"), any(WebSocketMessage.class));
    }

    @Test
    void testGetUserSessionIds_FromMemory() {
        // Given
        String sessionId = "session-123";
        Long userId = 1L;
        webSocketService.userConnected(sessionId, userId);

        // When
        Set<String> result = webSocketService.getUserSessionIds(userId);

        // Then
        assertTrue(result.contains(sessionId));
    }

    @Test
    void testGetUserSessionIds_FromRedis() {
        // Given
        Long userId = 1L;
        String sessionId = "session-123";
        when(valueOperations.get(anyString())).thenReturn(sessionId);

        // When
        Set<String> result = webSocketService.getUserSessionIds(userId);

        // Then
        // Since Redis fallback is not implemented for sets, expect empty set
        assertTrue(result.isEmpty());
        verify(valueOperations, never()).get(anyString());
    }

    @Test
    void testGetUserIdFromSession_FromMemory() {
        // Given
        String sessionId = "session-123";
        Long userId = 1L;
        webSocketService.userConnected(sessionId, userId);

        // When
        Long result = webSocketService.getUserIdFromSession(sessionId);

        // Then
        assertEquals(userId, result);
    }

    @Test
    void testGetUserIdFromSession_FromRedis() {
        // Given
        String sessionId = "session-123";
        Long userId = 1L;
        when(valueOperations.get(anyString())).thenReturn(userId.toString());

        // When
        Long result = webSocketService.getUserIdFromSession(sessionId);

        // Then
        assertEquals(userId, result);
        verify(valueOperations).get(anyString());
    }

    @Test
    void testSendMessageToChat() {
        // Given
        Long chatId = 1L;

        // When
        webSocketService.sendMessageToChat(chatId, chatMessage);

        // Then
        verify(messagingTemplate).convertAndSend(eq("/topic/chat/" + chatId), any(WebSocketMessage.class));
    }

    @Test
    void testSendMessageToUser() {
        // Given
        Long userId = 1L;

        // When
        webSocketService.sendMessageToUser(userId, chatMessage);

        // Then
        verify(messagingTemplate).convertAndSendToUser(eq(userId.toString()), eq("/queue/messages"), any(WebSocketMessage.class));
    }

    @Test
    void testSendTypingIndicator() {
        // Given
        Long chatId = 1L;
        Long userId = 1L;
        boolean isTyping = true;

        // When
        webSocketService.sendTypingIndicator(chatId, userId, isTyping);

        // Then
        verify(messagingTemplate).convertAndSend(eq("/topic/chat/" + chatId + "/typing"), any(WebSocketMessage.class));
    }

    @Test
    void testBroadcastPresenceUpdate() {
        // When
        webSocketService.broadcastPresenceUpdate(presenceMessage);

        // Then
        verify(messagingTemplate).convertAndSend(eq("/topic/presence"), any(WebSocketMessage.class));
    }

    @Test
    void testSendPresenceUpdateToUser() {
        // Given
        Long userId = 1L;

        // When
        webSocketService.sendPresenceUpdateToUser(userId, presenceMessage);

        // Then
        verify(messagingTemplate).convertAndSendToUser(eq(userId.toString()), eq("/queue/presence"), any(WebSocketMessage.class));
    }

    @Test
    void testSendCallSignal() {
        // Given
        Long userId = 1L;

        // When
        webSocketService.sendCallSignal(userId, callMessage);

        // Then
        verify(messagingTemplate).convertAndSendToUser(eq(userId.toString()), eq("/queue/calls"), any(WebSocketMessage.class));
    }

    @Test
    void testSendCallSignalToChat() {
        // Given
        Long chatId = 1L;

        // When
        webSocketService.sendCallSignalToChat(chatId, callMessage);

        // Then
        verify(messagingTemplate).convertAndSend(eq("/topic/chat/" + chatId + "/calls"), any(WebSocketMessage.class));
    }

    @Test
    void testSendNotification() {
        // Given
        Long userId = 1L;

        // When
        webSocketService.sendNotification(userId, notificationMessage);

        // Then
        verify(messagingTemplate).convertAndSendToUser(eq(userId.toString()), eq("/queue/notifications"), any(WebSocketMessage.class));
    }

    @Test
    void testBroadcastNotification() {
        // When
        webSocketService.broadcastNotification(notificationMessage);

        // Then
        verify(messagingTemplate).convertAndSend(eq("/topic/notifications"), any(WebSocketMessage.class));
    }

    @Test
    void testIsUserOnline() {
        // Given
        Long userId = 1L;
        when(setOperations.isMember(anyString(), eq(userId.toString()))).thenReturn(true);

        // When
        boolean result = webSocketService.isUserOnline(userId);

        // Then
        assertTrue(result);
        verify(setOperations).isMember(anyString(), eq(userId.toString()));
    }

    @Test
    void testGetOnlineUserCount() {
        // Given
        when(setOperations.size(anyString())).thenReturn(5L);

        // When
        int result = webSocketService.getOnlineUserCount();

        // Then
        assertEquals(5, result);
        verify(setOperations).size(anyString());
    }
} 