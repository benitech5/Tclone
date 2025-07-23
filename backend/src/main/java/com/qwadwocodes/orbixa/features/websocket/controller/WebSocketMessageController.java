package com.qwadwocodes.orbixa.features.websocket.controller;

import com.qwadwocodes.orbixa.features.chat.service.MessageService;
import com.qwadwocodes.orbixa.features.other.service.PresenceService;
import com.qwadwocodes.orbixa.features.websocket.dto.*;
import com.qwadwocodes.orbixa.features.websocket.service.WebSocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketMessageController {

    private final WebSocketService webSocketService;
    private final MessageService messageService;
    private final PresenceService presenceService;

    @MessageMapping("/chat.send")
    public void handleChatMessage(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        try {
            Long userId = getUserIdFromHeader(headerAccessor);
            if (userId == null) {
                log.warn("Unauthorized chat message attempt");
                return;
            }

            // Set sender information
            chatMessage.setSenderId(userId);
            chatMessage.setTimestamp(java.time.LocalDateTime.now());

            // Save message to database
            // Note: You'll need to convert ChatMessage to your Message entity
            // messageService.sendMessage(chatMessage.getChatId(), messageEntity);

            // Broadcast to chat
            webSocketService.sendMessageToChat(chatMessage.getChatId(), chatMessage);
            
            log.debug("Chat message handled: {} in chat: {}", chatMessage.getMessageId(), chatMessage.getChatId());
            
        } catch (Exception e) {
            log.error("Error handling chat message: {}", e.getMessage(), e);
        }
    }

    @MessageMapping("/chat.typing")
    public void handleTypingIndicator(@Payload TypingIndicator typingIndicator, SimpMessageHeaderAccessor headerAccessor) {
        try {
            Long userId = getUserIdFromHeader(headerAccessor);
            if (userId == null) {
                log.warn("Unauthorized typing indicator attempt");
                return;
            }

            // Update presence service
            presenceService.setTypingInChat(userId, typingIndicator.getChatId(), typingIndicator.isTyping());

            // Broadcast typing indicator
            webSocketService.sendTypingIndicator(typingIndicator.getChatId(), userId, typingIndicator.isTyping());
            
            log.debug("Typing indicator handled: user {} in chat {} is typing: {}", 
                     userId, typingIndicator.getChatId(), typingIndicator.isTyping());
            
        } catch (Exception e) {
            log.error("Error handling typing indicator: {}", e.getMessage(), e);
        }
    }

    @MessageMapping("/presence.update")
    public void handlePresenceUpdate(@Payload PresenceMessage presenceMessage, SimpMessageHeaderAccessor headerAccessor) {
        try {
            Long userId = getUserIdFromHeader(headerAccessor);
            if (userId == null) {
                log.warn("Unauthorized presence update attempt");
                return;
            }

            // Set user ID from session
            presenceMessage.setUserId(userId);
            presenceMessage.setTimestamp(java.time.LocalDateTime.now());

            // Update presence service
            presenceService.setUserStatus(userId, presenceMessage.getStatus());

            // Broadcast presence update
            webSocketService.broadcastPresenceUpdate(presenceMessage);
            
            log.debug("Presence update handled: user {} status: {}", userId, presenceMessage.getStatus());
            
        } catch (Exception e) {
            log.error("Error handling presence update: {}", e.getMessage(), e);
        }
    }

    @MessageMapping("/call.signal")
    public void handleCallSignal(@Payload CallMessage callMessage, SimpMessageHeaderAccessor headerAccessor) {
        try {
            Long userId = getUserIdFromHeader(headerAccessor);
            if (userId == null) {
                log.warn("Unauthorized call signal attempt");
                return;
            }

            // Set caller information
            callMessage.setCallerId(userId);
            callMessage.setTimestamp(java.time.LocalDateTime.now());

            // Handle different call actions
            switch (callMessage.getAction()) {
                case "RING":
                case "ANSWER":
                case "REJECT":
                case "END":
                case "MUTE":
                case "UNMUTE":
                case "HOLD":
                case "UNHOLD":
                case "ICE_CANDIDATE":
                case "SDP_OFFER":
                case "SDP_ANSWER":
                case "START_SCREEN_SHARE":
                case "STOP_SCREEN_SHARE":
                    // Relay to all participants except sender
                    for (Long participantId : callMessage.getParticipants()) {
                        if (!participantId.equals(userId)) {
                            webSocketService.sendCallSignal(participantId, callMessage);
                        }
                    }
                    break;
                default:
                    log.warn("Unknown call action: {}", callMessage.getAction());
            }

            log.debug("Call signal handled: {} for call: {} type: {}", callMessage.getAction(), callMessage.getCallId(), callMessage.getCallType());
        } catch (Exception e) {
            log.error("Error handling call signal: {}", e.getMessage(), e);
        }
    }

    @MessageMapping("/notification.ack")
    public void handleNotificationAcknowledgment(@Payload NotificationAck notificationAck, SimpMessageHeaderAccessor headerAccessor) {
        try {
            Long userId = getUserIdFromHeader(headerAccessor);
            if (userId == null) {
                log.warn("Unauthorized notification acknowledgment attempt");
                return;
            }

            // Mark notification as read
            // notificationService.markAsRead(notificationAck.getNotificationId(), userId);
            
            log.debug("Notification acknowledgment handled: {} for user: {}", 
                     notificationAck.getNotificationId(), userId);
            
        } catch (Exception e) {
            log.error("Error handling notification acknowledgment: {}", e.getMessage(), e);
        }
    }

    private Long getUserIdFromHeader(SimpMessageHeaderAccessor headerAccessor) {
        try {
            // Extract user ID from session attributes
            Object userIdObj = headerAccessor.getSessionAttributes().get("userId");
            if (userIdObj != null) {
                return Long.parseLong(userIdObj.toString());
            }
            
            // You might also implement JWT token extraction here
            // String token = headerAccessor.getFirstNativeHeader("Authorization");
            // return jwtService.extractUserId(token);
            
            return null;
        } catch (Exception e) {
            log.error("Error extracting user ID from header: {}", e.getMessage());
            return null;
        }
    }

    // Helper classes for WebSocket messages
    public static class TypingIndicator {
        private Long chatId;
        private boolean isTyping;
        
        // Getters and setters
        public Long getChatId() { return chatId; }
        public void setChatId(Long chatId) { this.chatId = chatId; }
        public boolean isTyping() { return isTyping; }
        public void setTyping(boolean typing) { isTyping = typing; }
    }

    public static class NotificationAck {
        private Long notificationId;
        
        // Getters and setters
        public Long getNotificationId() { return notificationId; }
        public void setNotificationId(Long notificationId) { this.notificationId = notificationId; }
    }
} 