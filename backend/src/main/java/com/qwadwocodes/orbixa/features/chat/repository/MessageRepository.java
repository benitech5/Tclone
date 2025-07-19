package com.qwadwocodes.orbixa.features.chat.repository;

import com.qwadwocodes.orbixa.features.chat.model.Chat;
import com.qwadwocodes.orbixa.features.chat.model.ChatGroup;
import com.qwadwocodes.orbixa.features.chat.model.Message;
import com.qwadwocodes.orbixa.features.profile.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByGroup(ChatGroup group);
    List<Message> findByChat(Chat chat);
    List<Message> findBySender(User sender);
    List<Message> findBySavedBy(User user);
    List<Message> findByPinnedBy(User user);
    List<Message> findByGroupAndFileUrlIsNotNull(ChatGroup group);
    List<Message> findByChatOrderByCreatedAtDesc(Chat chat);
    List<Message> findBySenderOrderByCreatedAtDesc(User sender);
} 
