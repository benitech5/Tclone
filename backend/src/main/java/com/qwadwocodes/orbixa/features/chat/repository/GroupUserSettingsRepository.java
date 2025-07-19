package com.qwadwocodes.orbixa.features.chat.repository;

import com.qwadwocodes.orbixa.features.chat.model.ChatGroup;
import com.qwadwocodes.orbixa.features.chat.model.GroupUserSettings;
import com.qwadwocodes.orbixa.features.profile.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupUserSettingsRepository extends JpaRepository<GroupUserSettings, Long> {
    Optional<GroupUserSettings> findByUserAndGroup(User user, ChatGroup group);
} 
