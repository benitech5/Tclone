package com.qwadwocodes.orbixa.features.websocket.handler;

import com.qwadwocodes.orbixa.features.websocket.service.WebSocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventHandler {

    private final WebSocketService webSocketService;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        
        // Extract user ID from the session (you might need to implement this based on your auth)
        Long userId = extractUserIdFromSession(headerAccessor);
        
        if (userId != null) {
            webSocketService.userConnected(sessionId, userId);
            log.info("WebSocket session connected: {} for user: {}", sessionId, userId);
        } else {
            log.warn("WebSocket session connected without user ID: {}", sessionId);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        
        Long userId = webSocketService.getUserIdFromSession(sessionId);
        if (userId != null) {
            webSocketService.userDisconnected(sessionId, userId);
            log.info("WebSocket session disconnected: {} for user: {}", sessionId, userId);
        } else {
            log.warn("WebSocket session disconnected without user ID: {}", sessionId);
        }
    }

    @EventListener
    public void handleWebSocketSubscribeListener(SessionSubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String destination = headerAccessor.getDestination();
        
        log.debug("User subscribed to: {} with session: {}", destination, sessionId);
    }

    @EventListener
    public void handleWebSocketUnsubscribeListener(SessionUnsubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String destination = headerAccessor.getDestination();
        
        log.debug("User unsubscribed from: {} with session: {}", destination, sessionId);
    }

    private Long extractUserIdFromSession(StompHeaderAccessor headerAccessor) {
        // This is a placeholder implementation
        // You should implement this based on your authentication mechanism
        // For example, you might extract the user ID from JWT token in headers
        
        try {
            // Check if there's a user ID in the session attributes
            Object userIdObj = headerAccessor.getSessionAttributes().get("userId");
            if (userIdObj != null) {
                return Long.parseLong(userIdObj.toString());
            }
            
            // You might also check headers for authentication token
            // and decode it to get the user ID
            
            return null;
        } catch (Exception e) {
            log.error("Error extracting user ID from session: {}", e.getMessage());
            return null;
        }
    }
} 