package com.qwadwocodes.orbixa.features.other.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String refreshToken;
    private String ip;
    private String deviceInfo;
    private LocalDateTime expiresAt;
} 
