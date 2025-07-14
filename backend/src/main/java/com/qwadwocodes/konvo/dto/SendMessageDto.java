package com.qwadwocodes.konvo.dto;

import lombok.Data;

@Data
public class SendMessageDto {
    private Long groupId;
    private String content;
    private String type; // e.g., text, image, etc.
    private Long replyToMessageId; // optional
} 