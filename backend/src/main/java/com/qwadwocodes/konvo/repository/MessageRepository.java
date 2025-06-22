package com.qwadwocodes.konvo.repository;

import com.qwadwocodes.konvo.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Find messages by conversation
    @Query("SELECT m FROM Message m WHERE m.conversationId = :conversationId ORDER BY m.createdAt DESC")
    Page<Message> findByConversationId(@Param("conversationId") String conversationId, Pageable pageable);

    // Find messages by group
    @Query("SELECT m FROM Message m WHERE m.group.id = :groupId ORDER BY m.createdAt DESC")
    Page<Message> findByGroupId(@Param("groupId") Long groupId, Pageable pageable);

    // Find messages by channel
    @Query("SELECT m FROM Message m WHERE m.channel.id = :channelId ORDER BY m.createdAt DESC")
    Page<Message> findByChannelId(@Param("channelId") Long channelId, Pageable pageable);

    // Find messages between two users
    @Query("SELECT m FROM Message m WHERE " +
           "(m.sender.id = :user1Id AND m.receiver.id = :user2Id) OR " +
           "(m.sender.id = :user2Id AND m.receiver.id = :user1Id) " +
           "ORDER BY m.createdAt DESC")
    Page<Message> findMessagesBetweenUsers(@Param("user1Id") Long user1Id, 
                                          @Param("user2Id") Long user2Id, 
                                          Pageable pageable);

    // Find unread messages for a user
    @Query("SELECT m FROM Message m WHERE m.receiver.id = :userId AND m.status != 'READ' ORDER BY m.createdAt DESC")
    List<Message> findUnreadMessagesForUser(@Param("userId") Long userId);

    // Find messages by sender
    @Query("SELECT m FROM Message m WHERE m.sender.id = :senderId ORDER BY m.createdAt DESC")
    Page<Message> findBySenderId(@Param("senderId") Long senderId, Pageable pageable);

    // Find messages by receiver
    @Query("SELECT m FROM Message m WHERE m.receiver.id = :receiverId ORDER BY m.createdAt DESC")
    Page<Message> findByReceiverId(@Param("receiverId") Long receiverId, Pageable pageable);

    // Find messages created after a specific time
    @Query("SELECT m FROM Message m WHERE m.createdAt > :since ORDER BY m.createdAt DESC")
    List<Message> findMessagesAfter(@Param("since") LocalDateTime since);

    // Find secret chat messages (for device sync)
    @Query("SELECT m FROM Message m WHERE m.isSecretChat = true AND m.sender.id = :userId ORDER BY m.createdAt DESC")
    List<Message> findSecretChatMessages(@Param("userId") Long userId);

    // Count unread messages for a user in a conversation
    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversationId = :conversationId AND m.receiver.id = :userId AND m.status != 'READ'")
    Long countUnreadMessagesInConversation(@Param("conversationId") String conversationId, 
                                          @Param("userId") Long userId);

    // Find messages that need to be expired (self-destruct)
    @Query("SELECT m FROM Message m WHERE m.expiresAt IS NOT NULL AND m.expiresAt <= :now")
    List<Message> findExpiredMessages(@Param("now") LocalDateTime now);
} 