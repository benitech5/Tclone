package com.qwadwocodes.orbixa.features.chat.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CallRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long callerId;
    private Long calleeId;
    private Long chatId;
    @Enumerated(EnumType.STRING)
    private CallType type;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private Long duration;

    public enum CallType {
        VOICE, VIDEO
    }
} 
