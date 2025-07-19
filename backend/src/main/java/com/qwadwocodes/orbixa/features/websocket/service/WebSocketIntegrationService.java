package com.qwadwocodes.orbixa.features.websocket.service;

import com.qwadwocodes.orbixa.features.chat.model.Chat;
import com.qwadwocodes.orbixa.features.chat.model.Message;
import com.qwadwocodes.orbixa.features.chat.service.CallService;
import com.qwadwocodes.orbixa.features.chat.service.ChatService;
import com.qwadwocodes.orbixa.features.chat.service.MessageService;
import com.qwadwocodes.orbixa.features.other.service.PresenceService;
import com.qwadwocodes.orbixa.features.websocket.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketIntegrationService {

    private final WebSocketService webSocketService;
    private final MessageService messageService;
    private final ChatService chatService;
    private final CallService callService;
    private final PresenceService presenceService;

    // Message-related WebSocket notifications
    public void notifyNewMessage(Message message) {
        try {
            ChatMessage chatMessage = convertToChatMessage(message);
            
            // Send to chat members
            webSocketService.sendMessageToChat(message.getChat().getId(), chatMessage);
            
            // Send individual notifications to chat members (except sender)
            List<Long> memberIds = chatService.getChatMemberIds(message.getChat().getId());
            for (Long memberId : memberIds) {
                if (!memberId.equals(message.getSender().getId())) {
                    // Send notification
                    NotificationMessage notification = createMessageNotification(message, memberId);
                    webSocketService.sendNotification(memberId, notification);
                }
            }
            
            log.debug("WebSocket notification sent for new message: {}", message.getId());
        } catch (Exception e) {
            log.error("Error sending WebSocket notification for message: {}", e.getMessage(), e);
        }
    }

    public void notifyMessageEdited(Message message) {
        try {
            ChatMessage chatMessage = convertToChatMessage(message);
            chatMessage.setIsEdited(true);
            
            webSocketService.sendMessageToChat(message.getChat().getId(), chatMessage);
            log.debug("WebSocket notification sent for edited message: {}", message.getId());
        } catch (Exception e) {
            log.error("Error sending WebSocket notification for edited message: {}", e.getMessage(), e);
        }
    }

    public void notifyMessageDeleted(Long messageId, Long chatId) {
        try {
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setMessageId(messageId);
            chatMessage.setChatId(chatId);
            chatMessage.setIsDeleted(true);
            chatMessage.setTimestamp(LocalDateTime.now());
            
            webSocketService.sendMessageToChat(chatId, chatMessage);
            log.debug("WebSocket notification sent for deleted message: {}", messageId);
        } catch (Exception e) {
            log.error("Error sending WebSocket notification for deleted message: {}", e.getMessage(), e);
        }
    }

    // Presence-related WebSocket notifications
    public void notifyPresenceUpdate(Long userId, String status) {
        try {
            PresenceMessage presenceMessage = new PresenceMessage();
            presenceMessage.setUserId(userId);
            presenceMessage.setStatus(status);
            presenceMessage.setTimestamp(LocalDateTime.now());
            
            webSocketService.broadcastPresenceUpdate(presenceMessage);
            log.debug("WebSocket notification sent for presence update: user {} status {}", userId, status);
        } catch (Exception e) {
            log.error("Error sending WebSocket notification for presence update: {}", e.getMessage(), e);
        }
    }

    public void notifyTypingIndicator(Long userId, Long chatId, boolean isTyping) {
        try {
            webSocketService.sendTypingIndicator(chatId, userId, isTyping);
            log.debug("WebSocket notification sent for typing indicator: user {} in chat {} typing {}", 
                     userId, chatId, isTyping);
        } catch (Exception e) {
            log.error("Error sending WebSocket notification for typing indicator: {}", e.getMessage(), e);
        }
    }

    // Call-related WebSocket notifications
    public void notifyCallInitiated(Long callId, Long callerId, List<Long> participants, String callType) {
        try {
            CallMessage callMessage = new CallMessage();
            callMessage.setCallId(callId);
            callMessage.setCallerId(callerId);
            callMessage.setParticipants(participants);
            callMessage.setCallType(callType);
            callMessage.setAction("RING");
            callMessage.setTimestamp(LocalDateTime.now());
            
            // Send to all participants except caller
            for (Long participantId : participants) {
                if (!participantId.equals(callerId)) {
                    webSocketService.sendCallSignal(participantId, callMessage);
                }
            }
            
            log.debug("WebSocket notification sent for call initiation: {}", callId);
        } catch (Exception e) {
            log.error("Error sending WebSocket notification for call initiation: {}", e.getMessage(), e);
        }
    }

    public void notifyCallAnswered(Long callId, Long answererId, Long callerId) {
        try {
            CallMessage callMessage = new CallMessage();
            callMessage.setCallId(callId);
            callMessage.setAction("ANSWER");
            callMessage.setTimestamp(LocalDateTime.now());
            
            // Send answer to caller
            webSocketService.sendCallSignal(callerId, callMessage);
            
            log.debug("WebSocket notification sent for call answer: {}", callId);
        } catch (Exception e) {
            log.error("Error sending WebSocket notification for call answer: {}", e.getMessage(), e);
        }
    }

    public void notifyCallEnded(Long callId, Long enderId, List<Long> participants) {
        try {
            CallMessage callMessage = new CallMessage();
            callMessage.setCallId(callId);
            callMessage.setAction("END");
            callMessage.setTimestamp(LocalDateTime.now());
            
            // Send end signal to all participants
            for (Long participantId : participants) {
                if (!participantId.equals(enderId)) {
                    webSocketService.sendCallSignal(participantId, callMessage);
                }
            }
            
            log.debug("WebSocket notification sent for call end: {}", callId);
        } catch (Exception e) {
            log.error("Error sending WebSocket notification for call end: {}", e.getMessage(), e);
        }
    }

    // Chat-related WebSocket notifications
    public void notifyChatCreated(Chat chat) {
        try {
            // Notify all members about new chat
            List<Long> memberIds = chatService.getChatMemberIds(chat.getId());
            for (Long memberId : memberIds) {
                NotificationMessage notification = createChatNotification(chat, memberId, "CHAT_CREATED");
                webSocketService.sendNotification(memberId, notification);
            }
            
            log.debug("WebSocket notification sent for chat creation: {}", chat.getId());
        } catch (Exception e) {
            log.error("Error sending WebSocket notification for chat creation: {}", e.getMessage(), e);
        }
    }

    public void notifyMemberAdded(Long chatId, Long newMemberId, Long addedBy) {
        try {
            // Notify new member about being added
            NotificationMessage notification = createChatNotification(null, newMemberId, "MEMBER_ADDED");
            webSocketService.sendNotification(newMemberId, notification);
            
            // Notify existing members about new member
            List<Long> memberIds = chatService.getChatMemberIds(chatId);
            for (Long memberId : memberIds) {
                if (!memberId.equals(newMemberId) && !memberId.equals(addedBy)) {
                    NotificationMessage memberNotification = createChatNotification(null, memberId, "NEW_MEMBER");
                    webSocketService.sendNotification(memberId, memberNotification);
                }
            }
            
            log.debug("WebSocket notification sent for member addition: user {} to chat {}", newMemberId, chatId);
        } catch (Exception e) {
            log.error("Error sending WebSocket notification for member addition: {}", e.getMessage(), e);
        }
    }

    // Helper methods
    private ChatMessage convertToChatMessage(Message message) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setMessageId(message.getId());
        chatMessage.setChatId(message.getChat().getId());
        chatMessage.setSenderId(message.getSender().getId());
        chatMessage.setContent(message.getContent());
        chatMessage.setMessageType(message.getMessageType().toString());
        chatMessage.setReplyToMessageId(message.getReplyToMessage() != null ? message.getReplyToMessage().getId() : null);
        // TODO: Parse reactions from JSON string to List<String>
        // chatMessage.setReactions(parseReactionsFromJson(message.getReactions()));
        chatMessage.setIsEdited(message.isEdited());
        chatMessage.setIsDeleted(message.isDeleted());
        chatMessage.setTimestamp(message.getTimestamp());
        chatMessage.setSenderName(message.getSender().getFirstName());
        chatMessage.setSenderAvatar(message.getSender().getProfilePictureUrl());
        
        return chatMessage;
    }

    private NotificationMessage createMessageNotification(Message message, Long recipientId) {
        NotificationMessage notification = new NotificationMessage();
        notification.setRecipientId(recipientId);
        notification.setType("NEW_MESSAGE");
        notification.setTitle("New Message");
        notification.setBody(message.getSender().getFirstName() + " sent you a message");
        notification.setTimestamp(LocalDateTime.now());
        notification.setSenderName(message.getSender().getFirstName());
        notification.setSenderAvatar(message.getSender().getProfilePictureUrl());
        
        return notification;
    }

    private NotificationMessage createChatNotification(Chat chat, Long recipientId, String type) {
        NotificationMessage notification = new NotificationMessage();
        notification.setRecipientId(recipientId);
        notification.setType(type);
        notification.setTitle("Chat Update");
        notification.setBody("Chat " + (chat != null ? chat.getName() : "") + " has been updated");
        notification.setTimestamp(LocalDateTime.now());
        
        return notification;
    }
} 