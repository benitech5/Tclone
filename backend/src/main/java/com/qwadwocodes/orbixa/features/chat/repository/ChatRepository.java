package com.qwadwocodes.orbixa.features.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qwadwocodes.orbixa.features.chat.model.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long> {
} 
