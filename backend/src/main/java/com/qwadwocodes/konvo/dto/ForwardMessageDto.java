package com.qwadwocodes.konvo.dto;

import lombok.Data;
import java.util.List;

@Data
public class ForwardMessageDto {
    private Long messageId;
    private List<Long> targetGroupIds;
} 