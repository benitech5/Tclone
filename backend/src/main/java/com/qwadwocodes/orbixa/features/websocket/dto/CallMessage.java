package com.qwadwocodes.orbixa.features.websocket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CallMessage {
    private Long callId;
    private Long callerId;
    private List<Long> participants;
    private String callType; // VOICE, VIDEO, GROUP_VOICE, GROUP_VIDEO
    private String action; // RING, ANSWER, REJECT, END, MUTE, UNMUTE, HOLD, UNHOLD
    private String sdpOffer;
    private String sdpAnswer;
    private String iceCandidate;
    private LocalDateTime timestamp;
    private String callerName;
    private String callerAvatar;
} 