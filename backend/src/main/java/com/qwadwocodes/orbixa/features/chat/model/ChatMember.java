package com.qwadwocodes.orbixa.features.chat.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(ChatMemberId.class)
public class ChatMember {
    @Id
    private Long chatId;
    @Id
    private Long userId;
    @Enumerated(EnumType.STRING)
    private Role role;
    private LocalDateTime joinedAt;

    public enum Role {
        ADMIN, MEMBER
    }
} 
