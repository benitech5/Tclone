package com.qwadwocodes.konvo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Entity
@Table(name = "group_user_settings")
@NoArgsConstructor
@AllArgsConstructor
public class GroupUserSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private ChatGroup group;

    @Column(name = "is_muted")
    private Boolean isMuted = false;

    @Column(name = "is_pinned")
    private Boolean isPinned = false;

    @Column(name = "theme")
    private String theme;
} 