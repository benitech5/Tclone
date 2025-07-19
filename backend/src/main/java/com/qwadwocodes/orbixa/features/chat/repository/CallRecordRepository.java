package com.qwadwocodes.orbixa.features.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qwadwocodes.orbixa.features.chat.model.CallRecord;

public interface CallRecordRepository extends JpaRepository<CallRecord, Long> {
} 
