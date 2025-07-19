package com.qwadwocodes.orbixa.features.websocket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private Long messageId;
    private Long chatId;
    private Long senderId;
    private String content;
    private String messageType; // TEXT, IMAGE, VIDEO, AUDIO, FILE
    private String mediaUrl;
    private Long replyToMessageId;
    private List<String> reactions;
    private boolean isEdited;
    private boolean isDeleted;
    private LocalDateTime timestamp;
    private String senderName;
    private String senderAvatar;
    
    public void setIsEdited(boolean isEdited) {
        this.isEdited = isEdited;
    }
    
    public void setIsDeleted(boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
    
    public Long getMessageId() {
        return messageId;
    }
} 