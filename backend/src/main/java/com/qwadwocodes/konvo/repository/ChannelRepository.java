package com.qwadwocodes.konvo.repository;

import com.qwadwocodes.konvo.model.Channel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Long> {

    // Find channel by username
    Optional<Channel> findByUsername(String username);

    // Find channels by creator
    @Query("SELECT c FROM Channel c WHERE c.creator.id = :creatorId ORDER BY c.createdAt DESC")
    List<Channel> findByCreatorId(@Param("creatorId") Long creatorId);

    // Find channels where user is admin
    @Query("SELECT c FROM Channel c JOIN c.admins a WHERE a.id = :adminId ORDER BY c.createdAt DESC")
    List<Channel> findByAdminId(@Param("adminId") Long adminId);

    // Find channels where user is subscriber
    @Query("SELECT c FROM Channel c JOIN c.subscribers s WHERE s.id = :subscriberId ORDER BY c.createdAt DESC")
    List<Channel> findBySubscriberId(@Param("subscriberId") Long subscriberId);

    // Find public channels
    @Query("SELECT c FROM Channel c WHERE c.isPrivate = false ORDER BY c.subscriberCount DESC")
    Page<Channel> findPublicChannels(Pageable pageable);

    // Search channels by name or username
    @Query("SELECT c FROM Channel c WHERE c.name LIKE %:searchTerm% OR c.username LIKE %:searchTerm% ORDER BY c.subscriberCount DESC")
    Page<Channel> searchChannels(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Find verified channels
    @Query("SELECT c FROM Channel c WHERE c.isVerified = true ORDER BY c.subscriberCount DESC")
    List<Channel> findVerifiedChannels();

    // Count channels created by user
    @Query("SELECT COUNT(c) FROM Channel c WHERE c.creator.id = :creatorId")
    Long countByCreatorId(@Param("creatorId") Long creatorId);

    // Check if user is subscriber to channel
    @Query("SELECT COUNT(c) > 0 FROM Channel c JOIN c.subscribers s WHERE c.id = :channelId AND s.id = :userId")
    boolean isUserSubscribedToChannel(@Param("channelId") Long channelId, @Param("userId") Long userId);

    // Check if user is admin of channel
    @Query("SELECT COUNT(c) > 0 FROM Channel c JOIN c.admins a WHERE c.id = :channelId AND a.id = :userId")
    boolean isUserAdminOfChannel(@Param("channelId") Long channelId, @Param("userId") Long userId);
} 