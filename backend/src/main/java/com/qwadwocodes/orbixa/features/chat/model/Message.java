package com.qwadwocodes.orbixa.features.chat.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.qwadwocodes.orbixa.features.profile.model.User;

@Data
@Entity
@Table(name = "messages")
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private ChatGroup group;

    @ManyToOne
    @JoinColumn(name = "reply_to_message_id")
    private Message replyTo;

    @ManyToMany
    @JoinTable(
        name = "saved_messages",
        joinColumns = @JoinColumn(name = "message_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> savedBy = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "pinned_messages",
        joinColumns = @JoinColumn(name = "message_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> pinnedBy = new HashSet<>();

    @Column(nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false)
    private MessageType messageType;

    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "is_encrypted")
    private boolean isEncrypted;

    @Column(name = "is_edited")
    private boolean isEdited;

    @Column(name = "reactions")
    private String reactions; // JSON string of reactions

    @ManyToOne
    @JoinColumn(name = "chat_id")
    private Chat chat;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum MessageType {
        TEXT,
        IMAGE,
        VIDEO,
        AUDIO,
        DOCUMENT,
        STICKER,
        LOCATION
    }
    
    public Message getReplyToMessage() {
        return replyTo;
    }
    
    public boolean isDeleted() {
        return deletedAt != null;
    }
    
    public LocalDateTime getTimestamp() {
        return createdAt;
    }
} 
