package com.qwadwocodes.orbixa.features.chat.dto;

import lombok.Data;
import java.util.Date;

@Data
public class MessageDto {
    private Long id;
    private Long groupId;
    private Long senderId;
    private String content;
    private String type;
    private Date sentAt;
    private Boolean isPinned;
    private Boolean isSaved;
    private String mediaUrl; // optional
} 
