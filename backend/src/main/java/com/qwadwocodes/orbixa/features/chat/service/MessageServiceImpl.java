package com.qwadwocodes.orbixa.features.chat.service;

import com.qwadwocodes.orbixa.features.chat.model.ChatGroup;
import com.qwadwocodes.orbixa.features.chat.model.Message;
import com.qwadwocodes.orbixa.features.chat.repository.MessageRepository;
import com.qwadwocodes.orbixa.features.profile.model.User;
import com.qwadwocodes.orbixa.features.profile.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageServiceImpl(MessageRepository messageRepository, 
                            UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Message> getMessages(Long chatId) {
        // TODO: Implement proper chat/group filtering
        // For now, return all messages
        return messageRepository.findAll();
    }

    @Override
    public void sendMessage(Long chatId, Message message) {
        // Set timestamps
        message.setCreatedAt(LocalDateTime.now());
        message.setUpdatedAt(LocalDateTime.now());
        
        // Set default message type if not specified
        if (message.getMessageType() == null) {
            message.setMessageType(Message.MessageType.TEXT);
        }
        
        // Validate sender exists
        if (message.getSender() == null || message.getSender().getId() == null) {
            throw new RuntimeException("Message sender is required");
        }
        
        // Ensure sender exists in database
        User sender = userRepository.findById(message.getSender().getId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        message.setSender(sender);
        
        // TODO: Validate that sender is member of the chat/group
        
        // Save the message
        messageRepository.save(message);
        
        // TODO: Send WebSocket notification to chat members
        // TODO: Handle media upload if message contains file
    }

    @Override
    public void editMessage(Long messageId, Message message) {
        Message existingMessage = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + messageId));
        
        // Update content
        existingMessage.setContent(message.getContent());
        existingMessage.setEdited(true);
        existingMessage.setUpdatedAt(LocalDateTime.now());
        
        // Update file info if provided
        if (message.getFileUrl() != null) {
            existingMessage.setFileUrl(message.getFileUrl());
            existingMessage.setFileName(message.getFileName());
            existingMessage.setFileSize(message.getFileSize());
            existingMessage.setFileType(message.getFileType());
        }
        
        messageRepository.save(existingMessage);
        
        // TODO: Send WebSocket notification about message edit
    }

    @Override
    public void deleteMessage(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + messageId));
        
        // Soft delete by setting deleted timestamp
        message.setDeletedAt(LocalDateTime.now());
        messageRepository.save(message);
        
        // TODO: Send WebSocket notification about message deletion
    }

    @Override
    public void replyToMessage(Long messageId, Message reply) {
        Message originalMessage = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Original message not found with id: " + messageId));
        
        // Set reply reference
        reply.setReplyTo(originalMessage);
        
        // Set timestamps
        reply.setCreatedAt(LocalDateTime.now());
        reply.setUpdatedAt(LocalDateTime.now());
        
        // Set default message type if not specified
        if (reply.getMessageType() == null) {
            reply.setMessageType(Message.MessageType.TEXT);
        }
        
        // Validate sender exists
        if (reply.getSender() == null || reply.getSender().getId() == null) {
            throw new RuntimeException("Reply sender is required");
        }
        
        // Ensure sender exists in database
        User sender = userRepository.findById(reply.getSender().getId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        reply.setSender(sender);
        
        // Save the reply
        messageRepository.save(reply);
        
        // TODO: Send WebSocket notification to chat members
    }

    @Override
    public void reactToMessage(Long messageId, String reaction) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + messageId));
        
        // TODO: Implement reaction system
        // This would require a separate Reaction entity or a JSON field
        // For now, just log the reaction
        System.out.println("Reaction '" + reaction + "' added to message " + messageId);
        
        // TODO: Send WebSocket notification about reaction
    }

    // Additional helper methods
    public List<Message> getMessagesByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return messageRepository.findBySender(user);
    }

    public List<Message> getSavedMessages(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return messageRepository.findBySavedBy(user);
    }

    public List<Message> getPinnedMessages(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return messageRepository.findByPinnedBy(user);
    }

    public void saveMessage(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + messageId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        message.getSavedBy().add(user);
        messageRepository.save(message);
    }

    public void pinMessage(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + messageId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        message.getPinnedBy().add(user);
        messageRepository.save(message);
    }
} 
