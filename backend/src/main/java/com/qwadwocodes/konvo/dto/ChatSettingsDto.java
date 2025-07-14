package com.qwadwocodes.konvo.dto;

import lombok.Data;

@Data
public class ChatSettingsDto {
    private Boolean isMuted;
    private Boolean isPinned;
    private String theme; // optional
} 