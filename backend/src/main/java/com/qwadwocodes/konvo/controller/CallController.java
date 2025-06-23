package com.qwadwocodes.konvo.controller;

import com.qwadwocodes.konvo.dto.CallSignalMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class CallController {
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/call.signal")
    public void handleCallSignal(@Payload CallSignalMessage signalMessage) {
        // Relay the signaling message to the intended recipient
        messagingTemplate.convertAndSendToUser(
                signalMessage.getTo(),
                "/queue/call",
                signalMessage
        );
    }
} 