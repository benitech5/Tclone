package com.qwadwocodes.orbixa.features.chat.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private ChatType type;
    private String title;
    private String description;
    private String photoUrl;
    private boolean isPublic;
    private String inviteLink;
    private LocalDateTime createdAt;

    public enum ChatType {
        PRIVATE, GROUP, CHANNEL
    }
    
    public String getName() {
        return title != null ? title : "Chat " + id;
    }
} 
