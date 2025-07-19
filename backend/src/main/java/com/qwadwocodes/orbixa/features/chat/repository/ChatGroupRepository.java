package com.qwadwocodes.orbixa.features.chat.repository;

import com.qwadwocodes.orbixa.features.chat.model.ChatGroup;
import com.qwadwocodes.orbixa.features.profile.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatGroupRepository extends JpaRepository<ChatGroup, Long> {
    List<ChatGroup> findByMembersContaining(User user);
} 
