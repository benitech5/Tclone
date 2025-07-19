package com.qwadwocodes.orbixa.features.chat.repository;

import com.qwadwocodes.orbixa.features.chat.model.ChatMember;
import com.qwadwocodes.orbixa.features.chat.model.ChatMemberId;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMemberRepository extends JpaRepository<ChatMember, ChatMemberId> {
    List<ChatMember> findByChatId(Long chatId);
} 
