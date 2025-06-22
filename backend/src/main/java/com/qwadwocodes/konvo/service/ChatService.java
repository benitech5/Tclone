package com.qwadwocodes.konvo.service;

import com.qwadwocodes.konvo.dto.CreateMessageRequest;
import com.qwadwocodes.konvo.model.*;
import com.qwadwocodes.konvo.repository.ChannelRepository;
import com.qwadwocodes.konvo.repository.ChatGroupRepository;
import com.qwadwocodes.konvo.repository.ConversationRepository;
import com.qwadwocodes.konvo.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final ChatGroupRepository chatGroupRepository;
    private final ChannelRepository channelRepository;

    public Message sendMessage(User sender, CreateMessageRequest request) {
        Message message = new Message();
        message.setSender(sender);
        message.setContent(request.getContent());
        message.setMessageType(request.getMessageType());
        message.setFileUrl(request.getFileUrl());
        message.setFileName(request.getFileName());
        message.setFileSize(request.getFileSize());
        message.setFileType(request.getFileType());
        message.setSecretChat(request.isSecretChat());
        message.setSelfDestructTimer(request.getSelfDestructTimer());
        message.setReplyToMessageId(request.getReplyToMessageId());
        message.setForwardedFromMessageId(request.getForwardedFromMessageId());

        // Set expiration time if self-destruct timer is set
        if (request.getSelfDestructTimer() != null && request.getSelfDestructTimer() > 0) {
            message.setExpiresAt(LocalDateTime.now().plusSeconds(request.getSelfDestructTimer()));
        }

        // Handle different message types
        if (request.getReceiverId() != null) {
            // One-on-one message
            message.setReceiver(new User());
            message.getReceiver().setId(request.getReceiverId());
            message.setConversationId(generateConversationId(sender.getId(), request.getReceiverId()));
        } else if (request.getGroupId() != null) {
            // Group message
            ChatGroup group = chatGroupRepository.findById(request.getGroupId())
                    .orElseThrow(() -> new RuntimeException("Group not found"));
            message.setGroup(group);
        } else if (request.getChannelId() != null) {
            // Channel message
            Channel channel = channelRepository.findById(request.getChannelId())
                    .orElseThrow(() -> new RuntimeException("Channel not found"));
            message.setChannel(channel);
        } else if (request.getConversationId() != null) {
            // Direct conversation message
            message.setConversationId(request.getConversationId());
        }

        Message savedMessage = messageRepository.save(message);
        
        // Update conversation last message if it's a one-on-one chat
        if (savedMessage.getConversationId() != null) {
            updateConversationLastMessage(savedMessage);
        }

        return savedMessage;
    }

    public void markConversationAsRead(String conversationId, Long userId) {
        List<Message> unreadMessages = messageRepository.findByConversationId(conversationId, null)
                .getContent()
                .stream()
                .filter(message -> message.getReceiver() != null && 
                                 message.getReceiver().getId().equals(userId) && 
                                 message.getStatus() != Message.MessageStatus.READ)
                .toList();

        for (Message message : unreadMessages) {
            message.setStatus(Message.MessageStatus.READ);
            message.setReadAt(LocalDateTime.now());
            messageRepository.save(message);
        }
    }

    private String generateConversationId(Long user1Id, Long user2Id) {
        // Create a consistent conversation ID regardless of sender/receiver order
        Long smallerId = Math.min(user1Id, user2Id);
        Long largerId = Math.max(user1Id, user2Id);
        return "conv_" + smallerId + "_" + largerId;
    }

    private void updateConversationLastMessage(Message message) {
        conversationRepository.findByConversationId(message.getConversationId())
                .ifPresent(conversation -> {
                    conversation.setLastMessageId(message.getId());
                    conversation.setLastMessageContent(message.getContent());
                    conversation.setLastMessageTimestamp(message.getCreatedAt());
                    conversationRepository.save(conversation);
                });
    }
} 