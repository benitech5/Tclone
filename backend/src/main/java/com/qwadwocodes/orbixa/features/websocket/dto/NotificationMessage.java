package com.qwadwocodes.orbixa.features.websocket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationMessage {
    private Long notificationId;
    private Long recipientId;
    private String type; // MESSAGE, CALL, CONTACT_REQUEST, GROUP_INVITE, etc.
    private String title;
    private String body;
    private String data; // JSON string with additional data
    private boolean isRead;
    private LocalDateTime timestamp;
    private String senderName;
    private String senderAvatar;
} 