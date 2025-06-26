package com.qwadwocodes.konvo.repository;

import com.qwadwocodes.konvo.model.Story;
import com.qwadwocodes.konvo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {
    Optional<Story> findByUser(User user);
}

@Repository
interface StorySegmentRepository extends JpaRepository<com.qwadwocodes.konvo.model.StorySegment, Long> {
} 