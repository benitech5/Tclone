package com.qwadwocodes.konvo.repository;

import com.qwadwocodes.konvo.model.ChatGroup;
import com.qwadwocodes.konvo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatGroupRepository extends JpaRepository<ChatGroup, Long> {
    List<ChatGroup> findByMembersContaining(User user);
} 