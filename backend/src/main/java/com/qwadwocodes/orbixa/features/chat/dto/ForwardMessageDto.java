package com.qwadwocodes.orbixa.features.chat.dto;

import lombok.Data;
import java.util.List;

@Data
public class ForwardMessageDto {
    private Long messageId;
    private List<Long> targetGroupIds;
} 
