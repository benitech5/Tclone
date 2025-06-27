package com.qwadwocodes.konvo.repository;

import com.qwadwocodes.konvo.model.StorySegment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StorySegmentRepository extends JpaRepository<StorySegment, Long> {
} 