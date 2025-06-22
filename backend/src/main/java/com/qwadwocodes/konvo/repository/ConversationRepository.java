package com.qwadwocodes.konvo.repository;

import com.qwadwocodes.konvo.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    // Find conversation by conversation ID
    Optional<Conversation> findByConversationId(String conversationId);

    // Find conversation between two users
    @Query("SELECT c FROM Conversation c JOIN c.participants p1 JOIN c.participants p2 " +
           "WHERE p1.id = :user1Id AND p2.id = :user2Id AND SIZE(c.participants) = 2")
    Optional<Conversation> findConversationBetweenUsers(@Param("user1Id") Long user1Id, 
                                                       @Param("user2Id") Long user2Id);

    // Find all conversations for a user
    @Query("SELECT c FROM Conversation c JOIN c.participants p WHERE p.id = :userId ORDER BY c.lastMessageTimestamp DESC")
    List<Conversation> findConversationsByUserId(@Param("userId") Long userId);

    // Find secret conversations for a user
    @Query("SELECT c FROM Conversation c JOIN c.participants p WHERE p.id = :userId AND c.isSecretChat = true ORDER BY c.lastMessageTimestamp DESC")
    List<Conversation> findSecretConversationsByUserId(@Param("userId") Long userId);

    // Check if conversation exists between users
    @Query("SELECT COUNT(c) > 0 FROM Conversation c JOIN c.participants p1 JOIN c.participants p2 " +
           "WHERE p1.id = :user1Id AND p2.id = :user2Id AND SIZE(c.participants) = 2")
    boolean existsConversationBetweenUsers(@Param("user1Id") Long user1Id, 
                                          @Param("user2Id") Long user2Id);
} 