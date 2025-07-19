package com.qwadwocodes.orbixa.features.settings.controller;

import com.qwadwocodes.orbixa.features.settings.model.Settings;
import com.qwadwocodes.orbixa.features.settings.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SettingsController {
    
    private final SettingsService settingsService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Settings>> getUserSettings(@PathVariable Long userId) {
        List<Settings> settings = settingsService.getUserSettings(userId);
        return ResponseEntity.ok(settings);
    }

    @GetMapping("/user/{userId}/map")
    public ResponseEntity<Map<String, String>> getAllSettingsAsMap(@PathVariable Long userId) {
        Map<String, String> settings = settingsService.getAllSettingsAsMap(userId);
        return ResponseEntity.ok(settings);
    }

    @GetMapping("/user/{userId}/{key}")
    public ResponseEntity<String> getSettingValue(@PathVariable Long userId, @PathVariable String key) {
        String value = settingsService.getSettingValue(userId, key);
        return ResponseEntity.ok(value);
    }

    @GetMapping("/user/{userId}/{key}/boolean")
    public ResponseEntity<Boolean> getBooleanSetting(
            @PathVariable Long userId, 
            @PathVariable String key,
            @RequestParam(defaultValue = "false") boolean defaultValue) {
        
        Boolean value = settingsService.getBooleanSetting(userId, key, defaultValue);
        return ResponseEntity.ok(value);
    }

    @GetMapping("/user/{userId}/{key}/integer")
    public ResponseEntity<Integer> getIntegerSetting(
            @PathVariable Long userId, 
            @PathVariable String key,
            @RequestParam(defaultValue = "0") int defaultValue) {
        
        Integer value = settingsService.getIntegerSetting(userId, key, defaultValue);
        return ResponseEntity.ok(value);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Void> setSetting(
            @PathVariable Long userId,
            @RequestParam String key,
            @RequestParam String value) {
        
        settingsService.setSetting(userId, key, value);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<Void> updateSetting(
            @PathVariable Long userId,
            @RequestParam String key,
            @RequestParam String value) {
        
        settingsService.updateSetting(userId, key, value);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{userId}/boolean")
    public ResponseEntity<Void> setBooleanSetting(
            @PathVariable Long userId,
            @RequestParam String key,
            @RequestParam boolean value) {
        
        settingsService.setBooleanSetting(userId, key, value);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{userId}/integer")
    public ResponseEntity<Void> setIntegerSetting(
            @PathVariable Long userId,
            @RequestParam String key,
            @RequestParam int value) {
        
        settingsService.setIntegerSetting(userId, key, value);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/{userId}/{key}")
    public ResponseEntity<Void> deleteSetting(@PathVariable Long userId, @PathVariable String key) {
        settingsService.deleteSetting(userId, key);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/user/{userId}/defaults")
    public ResponseEntity<Void> setDefaultSettings(@PathVariable Long userId) {
        settingsService.setDefaultSettings(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/user/{userId}/reset")
    public ResponseEntity<Void> resetUserSettings(@PathVariable Long userId) {
        settingsService.resetUserSettings(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}/{key}/exists")
    public ResponseEntity<Boolean> hasSetting(@PathVariable Long userId, @PathVariable String key) {
        boolean exists = settingsService.hasSetting(userId, key);
        return ResponseEntity.ok(exists);
    }

    @PutMapping("/user/{userId}/bulk")
    public ResponseEntity<Void> bulkUpdateSettings(
            @PathVariable Long userId,
            @RequestBody Map<String, String> settings) {
        
        settingsService.bulkUpdateSettings(userId, settings);
        return ResponseEntity.ok().build();
    }
} 
