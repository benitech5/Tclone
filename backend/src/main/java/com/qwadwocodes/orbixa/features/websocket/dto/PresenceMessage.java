package com.qwadwocodes.orbixa.features.websocket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PresenceMessage {
    private Long userId;
    private String status; // ONLINE, OFFLINE, AWAY, BUSY, INVISIBLE
    private boolean isTyping;
    private Long typingInChatId;
    private LocalDateTime lastSeen;
    private LocalDateTime timestamp;
    private String userName;
    private String userAvatar;
    
    public void setIsTyping(boolean isTyping) {
        this.isTyping = isTyping;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public void setTypingInChatId(Long typingInChatId) {
        this.typingInChatId = typingInChatId;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public Long getUserId() {
        return userId;
    }
} 