package com.qwadwocodes.orbixa.features.chat.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MediaFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long messageId;
    private String fileName;
    private String url;
    private String mimeType;
    private Long size;
    private LocalDateTime uploadedAt;
} 
