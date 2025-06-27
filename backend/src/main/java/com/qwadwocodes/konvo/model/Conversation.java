package com.qwadwocodes.konvo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "conversations")
@NoArgsConstructor
@AllArgsConstructor
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "conversation_id", nullable = false, unique = true)
    private String conversationId;

    @ManyToMany
    @JoinTable(
        name = "conversation_participants",
        joinColumns = @JoinColumn(name = "conversation_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> participants = new HashSet<>();

    @Column(name = "is_secret_chat")
    private boolean isSecretChat;

    @Column(name = "last_message_id")
    private Long lastMessageId;

    @Column(name = "last_message_content")
    private String lastMessageContent;

    @Column(name = "last_message_timestamp")
    private LocalDateTime lastMessageTimestamp;

    @Column(name = "unread_count_user1")
    private Integer unreadCountUser1;

    @Column(name = "unread_count_user2")
    private Integer unreadCountUser2;

    @Column(name = "is_archived_user1")
    private boolean isArchivedUser1;

    @Column(name = "is_archived_user2")
    private boolean isArchivedUser2;

    @Column(name = "is_muted_user1")
    private boolean isMutedUser1;

    @Column(name = "is_muted_user2")
    private boolean isMutedUser2;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (unreadCountUser1 == null) {
            unreadCountUser1 = 0;
        }
        if (unreadCountUser2 == null) {
            unreadCountUser2 = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 