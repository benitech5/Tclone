package com.qwadwocodes.konvo.dto;

import com.qwadwocodes.konvo.model.Message;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private Long id;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private Long groupId;
    private String groupName;
    private Long channelId;
    private String channelName;
    private String conversationId;
    private String content;
    private Message.MessageType messageType;
    private Message.MessageStatus status;
    private String fileUrl;
    private String fileName;
    private Long fileSize;
    private String fileType;
    private boolean isEncrypted;
    private boolean isEdited;
    private boolean isSecretChat;
    private Integer selfDestructTimer;
    private LocalDateTime expiresAt;
    private LocalDateTime readAt;
    private LocalDateTime deliveredAt;
    private Long replyToMessageId;
    private Long forwardedFromMessageId;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor to convert from Message entity
    public MessageDto(Message message) {
        this.id = message.getId();
        this.senderId = message.getSender().getId();
        this.senderName = message.getSender().getFirstName() + " " + message.getSender().getLastName();
        
        if (message.getReceiver() != null) {
            this.receiverId = message.getReceiver().getId();
            this.receiverName = message.getReceiver().getFirstName() + " " + message.getReceiver().getLastName();
        }
        
        if (message.getGroup() != null) {
            this.groupId = message.getGroup().getId();
            this.groupName = message.getGroup().getName();
        }
        
        if (message.getChannel() != null) {
            this.channelId = message.getChannel().getId();
            this.channelName = message.getChannel().getName();
        }
        
        this.conversationId = message.getConversationId();
        this.content = message.getContent();
        this.messageType = message.getMessageType();
        this.status = message.getStatus();
        this.fileUrl = message.getFileUrl();
        this.fileName = message.getFileName();
        this.fileSize = message.getFileSize();
        this.fileType = message.getFileType();
        this.isEncrypted = message.isEncrypted();
        this.isEdited = message.isEdited();
        this.isSecretChat = message.isSecretChat();
        this.selfDestructTimer = message.getSelfDestructTimer();
        this.expiresAt = message.getExpiresAt();
        this.readAt = message.getReadAt();
        this.deliveredAt = message.getDeliveredAt();
        this.replyToMessageId = message.getReplyToMessageId();
        this.forwardedFromMessageId = message.getForwardedFromMessageId();
        this.viewCount = message.getViewCount();
        this.createdAt = message.getCreatedAt();
        this.updatedAt = message.getUpdatedAt();
    }
} 