package com.qwadwocodes.orbixa.features.websocket.interceptor;

import com.qwadwocodes.orbixa.features.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final AuthService authService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        
        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Handle WebSocket connection authentication
            String token = extractToken(accessor);
            if (token != null) {
                try {
                    // Validate JWT token and extract user ID
                    Long userId = authService.validateTokenAndGetUserId(token);
                    if (userId != null) {
                        // Store user ID in session attributes
                        accessor.setUser(() -> "user-" + userId);
                        accessor.getSessionAttributes().put("userId", userId);
                        log.info("WebSocket authentication successful for user: {}", userId);
                    } else {
                        log.warn("Invalid token for WebSocket connection");
                        return null; // Reject the connection
                    }
                } catch (Exception e) {
                    log.error("Error during WebSocket authentication: {}", e.getMessage());
                    return null; // Reject the connection
                }
            } else {
                log.warn("No token provided for WebSocket connection");
                return null; // Reject the connection
            }
        }
        
        return message;
    }

    private String extractToken(StompHeaderAccessor accessor) {
        // Try to extract token from different possible locations
        
        // 1. Check Authorization header
        List<String> authHeaders = accessor.getNativeHeader("Authorization");
        if (authHeaders != null && !authHeaders.isEmpty()) {
            String authHeader = authHeaders.get(0);
            if (authHeader.startsWith("Bearer ")) {
                return authHeader.substring(7);
            }
        }
        
        // 2. Check custom token header
        List<String> tokenHeaders = accessor.getNativeHeader("X-Auth-Token");
        if (tokenHeaders != null && !tokenHeaders.isEmpty()) {
            return tokenHeaders.get(0);
        }
        
        // 3. Check query parameter (for SockJS fallback)
        String query = accessor.getFirstNativeHeader("query");
        if (query != null && query.contains("token=")) {
            String[] params = query.split("&");
            for (String param : params) {
                if (param.startsWith("token=")) {
                    return param.substring(6);
                }
            }
        }
        
        return null;
    }

    @Override
    public void afterSendCompletion(Message<?> message, MessageChannel channel, boolean sent, Exception ex) {
        if (ex != null) {
            log.error("Error sending WebSocket message: {}", ex.getMessage());
        }
    }
} 