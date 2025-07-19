package com.qwadwocodes.orbixa.features.chat.model;

import java.io.Serializable;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMemberId implements Serializable {
    private Long chatId;
    private Long userId;
} 
