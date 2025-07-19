package com.qwadwocodes.orbixa.features.other.service;

import com.qwadwocodes.orbixa.features.other.dto.PresenceDto;
import com.qwadwocodes.orbixa.features.profile.model.User;
import com.qwadwocodes.orbixa.features.profile.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class PresenceServiceImpl implements PresenceService {

    private final MockRedisService mockRedisService;
    private final UserRepository userRepository;

    public PresenceServiceImpl(MockRedisService mockRedisService,
                              UserRepository userRepository) {
        this.mockRedisService = mockRedisService;
        this.userRepository = userRepository;
    }

    @Override
    public String getUserStatus(Long userId) {
        String statusKey = "user:status:" + userId;
        String status = mockRedisService.get(statusKey);
        
        if (status == null) {
            // Check database for user's online status
            Optional<User> user = userRepository.findById(userId);
            if (user.isPresent()) {
                status = user.get().isOnline() ? "ONLINE" : "OFFLINE";
                // Cache the status
                mockRedisService.set(statusKey, status, 30, TimeUnit.MINUTES);
            } else {
                status = "OFFLINE";
            }
        }
        
        return status;
    }

    @Override
    public void setUserStatus(Long userId, String status) {
        String statusKey = "user:status:" + userId;
        mockRedisService.set(statusKey, status, 30, TimeUnit.MINUTES);
        
        // Update database
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setOnline("ONLINE".equals(status));
            if ("OFFLINE".equals(status)) {
                user.setLastSeen(LocalDateTime.now());
            }
            userRepository.save(user);
        }
    }

    @Override
    public void setTyping(Long userId, boolean typing) {
        String typingKey = "user:typing:" + userId;
        if (typing) {
            mockRedisService.set(typingKey, "true", 10, TimeUnit.SECONDS);
        } else {
            mockRedisService.delete(typingKey);
        }
    }

    @Override
    public void setTypingInChat(Long userId, Long chatId, boolean typing) {
        String typingKey = "chat:typing:" + chatId + ":" + userId;
        if (typing) {
            mockRedisService.set(typingKey, "true", 10, TimeUnit.SECONDS);
        } else {
            mockRedisService.delete(typingKey);
        }
    }

    @Override
    public boolean isUserTyping(Long userId) {
        String typingKey = "user:typing:" + userId;
        return mockRedisService.hasKey(typingKey);
    }

    @Override
    public boolean isUserTypingInChat(Long userId, Long chatId) {
        String typingKey = "chat:typing:" + chatId + ":" + userId;
        return mockRedisService.hasKey(typingKey);
    }

    @Override
    public List<Long> getTypingUsersInChat(Long chatId) {
        String pattern = "chat:typing:" + chatId + ":*";
        Set<String> keys = mockRedisService.keys(pattern);
        
        List<Long> typingUsers = new ArrayList<>();
        if (keys != null) {
            for (String key : keys) {
                String userIdStr = key.substring(key.lastIndexOf(":") + 1);
                try {
                    Long userId = Long.parseLong(userIdStr);
                    typingUsers.add(userId);
                } catch (NumberFormatException e) {
                    // Skip invalid user IDs
                }
            }
        }
        
        return typingUsers;
    }

    @Override
    public Map<Long, String> getUsersStatus(List<Long> userIds) {
        Map<Long, String> statusMap = new HashMap<>();
        
        for (Long userId : userIds) {
            statusMap.put(userId, getUserStatus(userId));
        }
        
        return statusMap;
    }

    @Override
    public void updateLastSeen(Long userId) {
        String lastSeenKey = "user:lastSeen:" + userId;
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        mockRedisService.set(lastSeenKey, timestamp, 24, TimeUnit.HOURS);
        
        // Update database
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setLastSeen(LocalDateTime.now());
            userRepository.save(user);
        }
    }

    @Override
    public void setUserOnline(Long userId) {
        setUserStatus(userId, "ONLINE");
        
        // Update database
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setOnline(true);
            userRepository.save(user);
        }
    }

    @Override
    public void setUserOffline(Long userId) {
        setUserStatus(userId, "OFFLINE");
        updateLastSeen(userId);
        
        // Update database
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setOnline(false);
            user.setLastSeen(LocalDateTime.now());
            userRepository.save(user);
        }
    }

    @Override
    public PresenceDto getPresenceInfo(Long userId) {
        PresenceDto presenceDto = new PresenceDto();
        presenceDto.setUserId(userId);
        presenceDto.setStatus(getUserStatus(userId));
        presenceDto.setTyping(isUserTyping(userId));
        
        // Get last seen from Redis
        String lastSeenKey = "user:lastSeen:" + userId;
        String lastSeenStr = mockRedisService.get(lastSeenKey);
        if (lastSeenStr != null) {
            try {
                LocalDateTime lastSeen = LocalDateTime.parse(lastSeenStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                presenceDto.setLastSeen(lastSeen);
            } catch (Exception e) {
                // Handle parsing error
            }
        }
        
        return presenceDto;
    }

    // Additional helper methods
    public void setUserAway(Long userId) {
        setUserStatus(userId, "AWAY");
    }

    public void setUserBusy(Long userId) {
        setUserStatus(userId, "BUSY");
    }

    public void setUserInvisible(Long userId) {
        setUserStatus(userId, "INVISIBLE");
    }

    public List<Long> getOnlineUsers() {
        // TODO: Implement efficient query to get all online users
        // This would require a custom Redis set or database query
        return new ArrayList<>();
    }

    public void clearUserPresence(Long userId) {
        // Clear all presence data for a user
        String statusKey = "user:status:" + userId;
        String typingKey = "user:typing:" + userId;
        String lastSeenKey = "user:lastSeen:" + userId;
        
        mockRedisService.delete(statusKey);
        mockRedisService.delete(typingKey);
        mockRedisService.delete(lastSeenKey);
        
        // Clear typing in all chats
        String pattern = "chat:typing:*:" + userId;
        Set<String> keys = mockRedisService.keys(pattern);
        if (keys != null) {
            mockRedisService.delete(keys);
        }
    }
} 
