package com.qwadwocodes.orbixa.features.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qwadwocodes.orbixa.features.chat.model.MediaFile;

public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {
} 
