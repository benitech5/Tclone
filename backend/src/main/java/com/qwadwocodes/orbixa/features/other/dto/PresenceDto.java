package com.qwadwocodes.orbixa.features.other.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PresenceDto {
    private Long userId;
    private String status;
    private boolean typing;
    private LocalDateTime lastSeen;
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public void setTyping(boolean typing) {
        this.typing = typing;
    }
    
    public void setLastSeen(LocalDateTime lastSeen) {
        this.lastSeen = lastSeen;
    }
} 
