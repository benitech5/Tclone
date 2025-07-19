package com.qwadwocodes.orbixa.features.settings.service;

import com.qwadwocodes.orbixa.features.settings.model.Settings;
import com.qwadwocodes.orbixa.features.settings.repository.SettingsRepository;
import com.qwadwocodes.orbixa.features.profile.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class SettingsServiceImpl implements SettingsService {

    private final SettingsRepository settingsRepository;
    private final UserRepository userRepository;

    public SettingsServiceImpl(SettingsRepository settingsRepository, 
                              UserRepository userRepository) {
        this.settingsRepository = settingsRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Settings> getUserSettings(Long userId) {
        // TODO: Implement custom query in repository
        return settingsRepository.findAll().stream()
                .filter(setting -> setting.getUserId().equals(userId))
                .toList();
    }

    @Override
    public Settings getSetting(Long userId, String key) {
        // TODO: Implement custom query in repository
        return settingsRepository.findAll().stream()
                .filter(setting -> setting.getUserId().equals(userId) && setting.getKey().equals(key))
                .findFirst()
                .orElse(null);
    }

    @Override
    public String getSettingValue(Long userId, String key) {
        Settings setting = getSetting(userId, key);
        return setting != null ? setting.getValue() : null;
    }

    @Override
    public void setSetting(Long userId, String key, String value) {
        // Validate user exists
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        // Check if setting already exists
        Settings existingSetting = getSetting(userId, key);
        if (existingSetting != null) {
            throw new RuntimeException("Setting already exists. Use updateSetting instead.");
        }

        Settings setting = new Settings();
        setting.setUserId(userId);
        setting.setKey(key);
        setting.setValue(value);
        
        settingsRepository.save(setting);
    }

    @Override
    public void updateSetting(Long userId, String key, String value) {
        Settings setting = getSetting(userId, key);
        if (setting == null) {
            // If setting doesn't exist, create it
            setSetting(userId, key, value);
            return;
        }

        setting.setValue(value);
        settingsRepository.save(setting);
    }

    @Override
    public void deleteSetting(Long userId, String key) {
        Settings setting = getSetting(userId, key);
        if (setting != null) {
            settingsRepository.delete(setting);
        }
    }

    @Override
    public Map<String, String> getAllSettingsAsMap(Long userId) {
        List<Settings> settings = getUserSettings(userId);
        Map<String, String> settingsMap = new HashMap<>();
        
        for (Settings setting : settings) {
            settingsMap.put(setting.getKey(), setting.getValue());
        }
        
        return settingsMap;
    }

    @Override
    public void setDefaultSettings(Long userId) {
        // Validate user exists
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        // Define default settings
        Map<String, String> defaultSettings = new HashMap<>();
        defaultSettings.put("notifications.enabled", "true");
        defaultSettings.put("notifications.sound", "true");
        defaultSettings.put("notifications.vibration", "true");
        defaultSettings.put("privacy.lastSeen", "contacts");
        defaultSettings.put("privacy.profilePhoto", "everyone");
        defaultSettings.put("privacy.status", "contacts");
        defaultSettings.put("chat.wallpaper", "default");
        defaultSettings.put("chat.fontSize", "medium");
        defaultSettings.put("chat.enterToSend", "true");
        defaultSettings.put("media.autoDownload", "wifi");
        defaultSettings.put("media.saveToGallery", "true");
        defaultSettings.put("security.twoFactorAuth", "false");
        defaultSettings.put("security.loginNotifications", "true");
        defaultSettings.put("language", "en");
        defaultSettings.put("theme", "light");

        // Set each default setting
        for (Map.Entry<String, String> entry : defaultSettings.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            
            // Only set if it doesn't already exist
            if (getSetting(userId, key) == null) {
                setSetting(userId, key, value);
            }
        }
    }

    @Override
    public void resetUserSettings(Long userId) {
        List<Settings> userSettings = getUserSettings(userId);
        settingsRepository.deleteAll(userSettings);
        
        // Set default settings after reset
        setDefaultSettings(userId);
    }

    // Additional helper methods
    public boolean getBooleanSetting(Long userId, String key, boolean defaultValue) {
        String value = getSettingValue(userId, key);
        if (value == null) {
            return defaultValue;
        }
        return Boolean.parseBoolean(value);
    }

    public int getIntegerSetting(Long userId, String key, int defaultValue) {
        String value = getSettingValue(userId, key);
        if (value == null) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    public void setBooleanSetting(Long userId, String key, boolean value) {
        updateSetting(userId, key, String.valueOf(value));
    }

    public void setIntegerSetting(Long userId, String key, int value) {
        updateSetting(userId, key, String.valueOf(value));
    }

    public boolean hasSetting(Long userId, String key) {
        return getSetting(userId, key) != null;
    }

    public void bulkUpdateSettings(Long userId, Map<String, String> settings) {
        for (Map.Entry<String, String> entry : settings.entrySet()) {
            updateSetting(userId, entry.getKey(), entry.getValue());
        }
    }
} 
