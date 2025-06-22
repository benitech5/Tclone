package com.qwadwocodes.konvo.repository;

import com.qwadwocodes.konvo.model.ChatGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatGroupRepository extends JpaRepository<ChatGroup, Long> {

    // Find groups by creator
    @Query("SELECT g FROM ChatGroup g WHERE g.creator.id = :creatorId ORDER BY g.createdAt DESC")
    List<ChatGroup> findByCreatorId(@Param("creatorId") Long creatorId);

    // Find groups where user is member
    @Query("SELECT g FROM ChatGroup g JOIN g.members m WHERE m.id = :memberId ORDER BY g.createdAt DESC")
    List<ChatGroup> findByMemberId(@Param("memberId") Long memberId);

    // Find groups where user is admin
    @Query("SELECT g FROM ChatGroup g JOIN g.admins a WHERE a.id = :adminId ORDER BY g.createdAt DESC")
    List<ChatGroup> findByAdminId(@Param("adminId") Long adminId);

    // Find public groups
    @Query("SELECT g FROM ChatGroup g WHERE g.isPrivate = false ORDER BY g.createdAt DESC")
    Page<ChatGroup> findPublicGroups(Pageable pageable);

    // Search groups by name
    @Query("SELECT g FROM ChatGroup g WHERE g.name LIKE %:searchTerm% ORDER BY g.createdAt DESC")
    Page<ChatGroup> searchGroups(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Find group by invite link
    Optional<ChatGroup> findByInviteLink(String inviteLink);

    // Check if user is member of group
    @Query("SELECT COUNT(g) > 0 FROM ChatGroup g JOIN g.members m WHERE g.id = :groupId AND m.id = :userId")
    boolean isUserMemberOfGroup(@Param("groupId") Long groupId, @Param("userId") Long userId);

    // Check if user is admin of group
    @Query("SELECT COUNT(g) > 0 FROM ChatGroup g JOIN g.admins a WHERE g.id = :groupId AND a.id = :userId")
    boolean isUserAdminOfGroup(@Param("groupId") Long groupId, @Param("userId") Long userId);

    // Count groups created by user
    @Query("SELECT COUNT(g) FROM ChatGroup g WHERE g.creator.id = :creatorId")
    Long countByCreatorId(@Param("creatorId") Long creatorId);
} 