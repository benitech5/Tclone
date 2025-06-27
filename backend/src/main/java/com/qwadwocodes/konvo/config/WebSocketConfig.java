package com.qwadwocodes.konvo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // These are destinations that the server will send messages to.
        // The client will subscribe to these to receive messages.
        // e.g., client subscribes to "/topic/public"
        config.enableSimpleBroker("/topic");
        
        // This is a prefix for message mappings.
        // When a client sends a message, it will be routed to a @MessageMapping in a controller.
        // e.g., client sends a message to "/app/chat.sendMessage"
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // This is the endpoint that the client will connect to to establish the WebSocket connection.
        // "/ws" is a common convention for WebSocket endpoints.
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
} 