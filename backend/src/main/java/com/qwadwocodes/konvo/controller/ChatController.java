package com.qwadwocodes.konvo.controller;

import com.qwadwocodes.konvo.dto.ChatMessage;
import com.qwadwocodes.konvo.dto.CreateMessageRequest;
import com.qwadwocodes.konvo.dto.MessageDto;
import com.qwadwocodes.konvo.model.Message;
import com.qwadwocodes.konvo.model.User;
import com.qwadwocodes.konvo.repository.MessageRepository;
import com.qwadwocodes.konvo.repository.UserRepository;
import com.qwadwocodes.konvo.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    private final ChatService chatService;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    // WebSocket message handling
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    // One-on-One Chat Endpoints
    @PostMapping("/messages")
    public ResponseEntity<MessageDto> sendMessage(@RequestBody CreateMessageRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        logger.info("sendMessage endpoint hit. Auth: {}", auth);
        String phoneNumber = auth.getName();
        logger.info("Authenticated phone number: {}", phoneNumber);
        User sender = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = chatService.sendMessage(sender, request);
        return ResponseEntity.ok(new MessageDto(message));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<Page<MessageDto>> getConversationMessages(
            @PathVariable String conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findByConversationId(conversationId, pageable);
        Page<MessageDto> messageDtos = messages.map(MessageDto::new);
        return ResponseEntity.ok(messageDtos);
    }

    @GetMapping("/users/{userId}/messages")
    public ResponseEntity<Page<MessageDto>> getMessagesWithUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String phoneNumber = auth.getName();
        User currentUser = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findMessagesBetweenUsers(currentUser.getId(), userId, pageable);
        Page<MessageDto> messageDtos = messages.map(MessageDto::new);
        return ResponseEntity.ok(messageDtos);
    }

    // Group Chat Endpoints
    @GetMapping("/groups/{groupId}/messages")
    public ResponseEntity<Page<MessageDto>> getGroupMessages(
            @PathVariable Long groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findByGroupId(groupId, pageable);
        Page<MessageDto> messageDtos = messages.map(MessageDto::new);
        return ResponseEntity.ok(messageDtos);
    }

    // Channel Endpoints
    @GetMapping("/channels/{channelId}/messages")
    public ResponseEntity<Page<MessageDto>> getChannelMessages(
            @PathVariable Long channelId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findByChannelId(channelId, pageable);
        Page<MessageDto> messageDtos = messages.map(MessageDto::new);
        return ResponseEntity.ok(messageDtos);
    }

    // Message Status Updates
    @PutMapping("/messages/{messageId}/status")
    public ResponseEntity<MessageDto> updateMessageStatus(
            @PathVariable Long messageId,
            @RequestParam Message.MessageStatus status) {
        
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        message.setStatus(status);
        
        if (status == Message.MessageStatus.DELIVERED && message.getDeliveredAt() == null) {
            message.setDeliveredAt(LocalDateTime.now());
        } else if (status == Message.MessageStatus.READ && message.getReadAt() == null) {
            message.setReadAt(LocalDateTime.now());
        }
        
        Message savedMessage = messageRepository.save(message);
        return ResponseEntity.ok(new MessageDto(savedMessage));
    }

    // Message Actions
    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long messageId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String phoneNumber = auth.getName();
        User currentUser = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        // Check if user is the sender or has admin rights
        if (!message.getSender().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized to delete this message");
        }

        message.setDeletedAt(LocalDateTime.now());
        messageRepository.save(message);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/messages/{messageId}/edit")
    public ResponseEntity<MessageDto> editMessage(
            @PathVariable Long messageId,
            @RequestBody String newContent) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String phoneNumber = auth.getName();
        User currentUser = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getSender().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized to edit this message");
        }

        message.setContent(newContent);
        message.setEdited(true);
        Message savedMessage = messageRepository.save(message);
        return ResponseEntity.ok(new MessageDto(savedMessage));
    }

    // Unread Messages
    @GetMapping("/messages/unread")
    public ResponseEntity<List<MessageDto>> getUnreadMessages() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String phoneNumber = auth.getName();
        User currentUser = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Message> unreadMessages = messageRepository.findUnreadMessagesForUser(currentUser.getId());
        List<MessageDto> messageDtos = unreadMessages.stream().map(MessageDto::new).toList();
        return ResponseEntity.ok(messageDtos);
    }

    // Mark messages as read
    @PutMapping("/conversations/{conversationId}/read")
    public ResponseEntity<Void> markConversationAsRead(@PathVariable String conversationId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String phoneNumber = auth.getName();
        User currentUser = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        chatService.markConversationAsRead(conversationId, currentUser.getId());
        return ResponseEntity.ok().build();
    }
} 