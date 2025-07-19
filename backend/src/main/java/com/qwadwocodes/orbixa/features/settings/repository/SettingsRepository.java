package com.qwadwocodes.orbixa.features.settings.repository;

import com.qwadwocodes.orbixa.features.settings.model.Settings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SettingsRepository extends JpaRepository<Settings, Long> {
} 
