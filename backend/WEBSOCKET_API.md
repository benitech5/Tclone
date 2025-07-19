# Orbixa WebSocket API Documentation

## Overview

The Orbixa backend implements a comprehensive WebSocket system for real-time communication including:
- Real-time messaging
- Presence updates and typing indicators
- Call signaling
- Push notifications
- User session management

## Connection

### WebSocket Endpoints
- **SockJS**: `ws://localhost:8080/ws` (with SockJS fallback)
- **Plain WebSocket**: `ws://localhost:8080/ws`

### Authentication
WebSocket connections require JWT authentication. Include the token in one of these ways:

1. **Authorization Header**: `Authorization: Bearer <jwt_token>`
2. **Custom Header**: `X-Auth-Token: <jwt_token>`
3. **Query Parameter**: `?token=<jwt_token>` (for SockJS fallback)

## Message Types

### 1. Chat Messages

#### Send Message
- **Destination**: `/app/chat.send`
- **Payload**:
```json
{
  "chatId": 123,
  "content": "Hello world!",
  "messageType": "TEXT",
  "replyToMessageId": null,
  "mediaUrl": null
}
```

#### Receive Message
- **Destination**: `/topic/chat/{chatId}`
- **Payload**:
```json
{
  "type": "CHAT_MESSAGE",
  "senderId": "456",
  "payload": {
    "messageId": 789,
    "chatId": 123,
    "senderId": 456,
    "content": "Hello world!",
    "messageType": "TEXT",
    "timestamp": "2024-01-01T12:00:00",
    "senderName": "John Doe",
    "senderAvatar": "https://example.com/avatar.jpg"
  }
}
```

### 2. Typing Indicators

#### Send Typing Indicator
- **Destination**: `/app/chat.typing`
- **Payload**:
```json
{
  "chatId": 123,
  "isTyping": true
}
```

#### Receive Typing Indicator
- **Destination**: `/topic/chat/{chatId}/typing`
- **Payload**:
```json
{
  "type": "TYPING_INDICATOR",
  "payload": {
    "userId": 456,
    "isTyping": true,
    "typingInChatId": 123,
    "timestamp": "2024-01-01T12:00:00"
  }
}
```

### 3. Presence Updates

#### Send Presence Update
- **Destination**: `/app/presence.update`
- **Payload**:
```json
{
  "status": "ONLINE",
  "isTyping": false,
  "typingInChatId": null
}
```

#### Receive Presence Update
- **Destination**: `/topic/presence`
- **Payload**:
```json
{
  "type": "PRESENCE_UPDATE",
  "payload": {
    "userId": 456,
    "status": "ONLINE",
    "isTyping": false,
    "lastSeen": "2024-01-01T12:00:00",
    "timestamp": "2024-01-01T12:00:00"
  }
}
```

### 4. Call Signaling

#### Send Call Signal
- **Destination**: `/app/call.signal`
- **Payload**:
```json
{
  "callId": 789,
  "participants": [456, 789],
  "callType": "VOICE",
  "action": "RING",
  "sdpOffer": null,
  "sdpAnswer": null,
  "iceCandidate": null
}
```

#### Receive Call Signal
- **Destination**: `/user/{userId}/queue/calls`
- **Payload**:
```json
{
  "type": "CALL_SIGNAL",
  "payload": {
    "callId": 789,
    "callerId": 456,
    "participants": [456, 789],
    "callType": "VOICE",
    "action": "RING",
    "timestamp": "2024-01-01T12:00:00"
  }
}
```

### 5. Notifications

#### Receive Notification
- **Destination**: `/user/{userId}/queue/notifications`
- **Payload**:
```json
{
  "type": "NOTIFICATION",
  "payload": {
    "notificationId": 123,
    "recipientId": 456,
    "type": "NEW_MESSAGE",
    "title": "New Message",
    "body": "John Doe sent you a message",
    "timestamp": "2024-01-01T12:00:00"
  }
}
```

## Subscription Destinations

### User-Specific Queues
- `/user/{userId}/queue/messages` - Personal messages
- `/user/{userId}/queue/notifications` - Personal notifications
- `/user/{userId}/queue/presence` - Personal presence updates
- `/user/{userId}/queue/calls` - Call signals

### Chat-Specific Topics
- `/topic/chat/{chatId}` - Chat messages
- `/topic/chat/{chatId}/typing` - Typing indicators
- `/topic/chat/{chatId}/calls` - Call signals

### Broadcast Topics
- `/topic/presence` - Global presence updates
- `/topic/notifications` - Broadcast notifications
- `/topic/broadcast` - General broadcasts

## Client Implementation Example

### JavaScript (with SockJS and STOMP)

```javascript
// Connect to WebSocket
const socket = new SockJS('/ws');
const stompClient = Stomp.over(socket);

const headers = {
    'Authorization': 'Bearer ' + jwtToken
};

stompClient.connect(headers, function(frame) {
    console.log('Connected: ' + frame);
    
    // Subscribe to user-specific queues
    stompClient.subscribe('/user/' + userId + '/queue/messages', function(message) {
        console.log('Received message: ' + message.body);
    });
    
    // Subscribe to chat messages
    stompClient.subscribe('/topic/chat/' + chatId, function(message) {
        console.log('Chat message: ' + message.body);
    });
    
    // Subscribe to presence updates
    stompClient.subscribe('/topic/presence', function(message) {
        console.log('Presence update: ' + message.body);
    });
    
}, function(error) {
    console.log('Connection error: ' + error);
});

// Send a message
function sendMessage(chatId, content) {
    const message = {
        chatId: chatId,
        content: content,
        messageType: 'TEXT'
    };
    
    stompClient.send('/app/chat.send', {}, JSON.stringify(message));
}

// Send typing indicator
function sendTypingIndicator(chatId, isTyping) {
    const indicator = {
        chatId: chatId,
        isTyping: isTyping
    };
    
    stompClient.send('/app/chat.typing', {}, JSON.stringify(indicator));
}
```

### React Hook Example

```javascript
import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export const useWebSocket = (jwtToken, userId) => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const stompClient = useRef(null);

    useEffect(() => {
        if (!jwtToken || !userId) return;

        const socket = new SockJS('/ws');
        stompClient.current = Stomp.over(socket);

        const headers = {
            'Authorization': 'Bearer ' + jwtToken
        };

        stompClient.current.connect(headers, (frame) => {
            setIsConnected(true);
            console.log('Connected: ' + frame);

            // Subscribe to messages
            stompClient.current.subscribe('/user/' + userId + '/queue/messages', (message) => {
                const data = JSON.parse(message.body);
                setMessages(prev => [...prev, data]);
            });

        }, (error) => {
            setIsConnected(false);
            console.log('Connection error: ' + error);
        });

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
            }
        };
    }, [jwtToken, userId]);

    const sendMessage = (chatId, content) => {
        if (stompClient.current && isConnected) {
            const message = {
                chatId: chatId,
                content: content,
                messageType: 'TEXT'
            };
            stompClient.current.send('/app/chat.send', {}, JSON.stringify(message));
        }
    };

    return { isConnected, messages, sendMessage };
};
```

## Error Handling

### Connection Errors
- **401 Unauthorized**: Invalid or missing JWT token
- **403 Forbidden**: Token expired or insufficient permissions
- **500 Internal Server Error**: Server-side WebSocket error

### Message Errors
- **400 Bad Request**: Invalid message format
- **404 Not Found**: Chat or user not found
- **409 Conflict**: User not member of chat

## Security Considerations

1. **Authentication**: All WebSocket connections require valid JWT tokens
2. **Authorization**: Users can only access their own data and chats they're members of
3. **Rate Limiting**: Consider implementing rate limiting for message sending
4. **Input Validation**: All incoming messages are validated
5. **Session Management**: User sessions are tracked and cleaned up on disconnect

## Performance Considerations

1. **Redis Caching**: Session data and presence information are cached in Redis
2. **Message Queuing**: Large message volumes can be handled with message queues
3. **Connection Pooling**: WebSocket connections are efficiently managed
4. **Memory Management**: Disconnected sessions are automatically cleaned up

## Testing

Use the provided test client at `/websocket-test.html` to test WebSocket functionality:

1. Start the application
2. Navigate to `http://localhost:8080/websocket-test.html`
3. Enter your JWT token and user ID
4. Connect and test various WebSocket features

## Troubleshooting

### Common Issues

1. **Connection Refused**: Ensure the WebSocket endpoint is accessible
2. **Authentication Failed**: Verify JWT token is valid and not expired
3. **Messages Not Received**: Check subscription destinations and user permissions
4. **High Memory Usage**: Monitor for disconnected sessions that aren't cleaned up

### Debug Logging

Enable debug logging by setting the log level:
```properties
logging.level.com.qwadwocodes.orbixa.features.websocket=DEBUG
``` 