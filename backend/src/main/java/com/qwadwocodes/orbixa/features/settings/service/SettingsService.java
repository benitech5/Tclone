package com.qwadwocodes.orbixa.features.settings.service;

import com.qwadwocodes.orbixa.features.settings.dto.SettingsDto;
import com.qwadwocodes.orbixa.features.settings.model.Settings;

import java.util.List;
import java.util.Map;

public interface SettingsService {
    List<Settings> getUserSettings(Long userId);
    Settings getSetting(Long userId, String key);
    String getSettingValue(Long userId, String key);
    boolean getBooleanSetting(Long userId, String key, boolean defaultValue);
    int getIntegerSetting(Long userId, String key, int defaultValue);
    void setSetting(Long userId, String key, String value);
    void updateSetting(Long userId, String key, String value);
    void setBooleanSetting(Long userId, String key, boolean value);
    void setIntegerSetting(Long userId, String key, int value);
    void deleteSetting(Long userId, String key);
    Map<String, String> getAllSettingsAsMap(Long userId);
    void setDefaultSettings(Long userId);
    void resetUserSettings(Long userId);
    boolean hasSetting(Long userId, String key);
    void bulkUpdateSettings(Long userId, Map<String, String> settings);
} 
