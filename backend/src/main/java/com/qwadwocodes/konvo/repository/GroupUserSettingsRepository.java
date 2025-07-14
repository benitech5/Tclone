package com.qwadwocodes.konvo.repository;

import com.qwadwocodes.konvo.model.GroupUserSettings;
import com.qwadwocodes.konvo.model.ChatGroup;
import com.qwadwocodes.konvo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupUserSettingsRepository extends JpaRepository<GroupUserSettings, Long> {
    Optional<GroupUserSettings> findByUserAndGroup(User user, ChatGroup group);
} 