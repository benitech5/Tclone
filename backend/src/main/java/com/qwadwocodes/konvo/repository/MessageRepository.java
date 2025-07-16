package com.qwadwocodes.konvo.repository;

import com.qwadwocodes.konvo.model.Message;
import com.qwadwocodes.konvo.model.ChatGroup;
import com.qwadwocodes.konvo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByGroup(ChatGroup group);
    List<Message> findBySender(User sender);
    List<Message> findBySavedBy(User user);
    List<Message> findByPinnedBy(User user);
    List<Message> findByGroupAndFileUrlIsNotNull(ChatGroup group);
} 