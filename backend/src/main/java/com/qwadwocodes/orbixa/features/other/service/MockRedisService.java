package com.qwadwocodes.orbixa.features.other.service;

import org.springframework.stereotype.Service;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.HashSet;
import java.util.Set;

@Service
public class MockRedisService {
    
    private final ConcurrentHashMap<String, String> stringStore = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, java.util.Set<String>> setStore = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> expiryStore = new ConcurrentHashMap<>();
    
    public void set(String key, String value, Duration duration) {
        stringStore.put(key, value);
        if (duration != null) {
            expiryStore.put(key, System.currentTimeMillis() + duration.toMillis());
        }
    }
    
    public void set(String key, String value, long timeout, TimeUnit unit) {
        stringStore.put(key, value);
        if (timeout > 0) {
            expiryStore.put(key, System.currentTimeMillis() + unit.toMillis(timeout));
        }
    }
    
    public String get(String key) {
        Long expiry = expiryStore.get(key);
        if (expiry != null && System.currentTimeMillis() > expiry) {
            stringStore.remove(key);
            expiryStore.remove(key);
            return null;
        }
        return stringStore.get(key);
    }
    
    public void delete(String key) {
        stringStore.remove(key);
        expiryStore.remove(key);
    }
    
    public void addToSet(String key, String value) {
        setStore.computeIfAbsent(key, k -> ConcurrentHashMap.newKeySet()).add(value);
    }
    
    public void removeFromSet(String key, String value) {
        java.util.Set<String> set = setStore.get(key);
        if (set != null) {
            set.remove(value);
        }
    }
    
    public boolean isMember(String key, String value) {
        java.util.Set<String> set = setStore.get(key);
        return set != null && set.contains(value);
    }
    
    public Long setSize(String key) {
        java.util.Set<String> set = setStore.get(key);
        return set != null ? (long) set.size() : 0L;
    }
    
    public boolean hasKey(String key) {
        return stringStore.containsKey(key) || setStore.containsKey(key);
    }
    
    public Set<String> keys(String pattern) {
        Set<String> result = new HashSet<>();
        String regexPattern = pattern.replace("*", ".*");
        
        for (String key : stringStore.keySet()) {
            if (key.matches(regexPattern)) {
                result.add(key);
            }
        }
        
        for (String key : setStore.keySet()) {
            if (key.matches(regexPattern)) {
                result.add(key);
            }
        }
        
        return result;
    }
    
    public void delete(Set<String> keys) {
        for (String key : keys) {
            delete(key);
        }
    }
} 