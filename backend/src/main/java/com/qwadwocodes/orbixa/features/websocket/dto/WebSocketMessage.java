package com.qwadwocodes.orbixa.features.websocket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessage<T> {
    private String type;
    private String senderId;
    private String recipientId;
    private T payload;
    private LocalDateTime timestamp;
    private String sessionId;
    
    public WebSocketMessage(String type, T payload) {
        this.type = type;
        this.payload = payload;
        this.timestamp = LocalDateTime.now();
    }
    
    public WebSocketMessage(String type, String senderId, T payload) {
        this.type = type;
        this.senderId = senderId;
        this.payload = payload;
        this.timestamp = LocalDateTime.now();
    }
} 