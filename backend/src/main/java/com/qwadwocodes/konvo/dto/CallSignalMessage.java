package com.qwadwocodes.konvo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CallSignalMessage {
    private String type; // offer, answer, ice-candidate, call-request, call-accept, call-reject, call-end
    private String from; // sender userId
    private String to;   // recipient userId
    private Map<String, Object> payload; // signaling data (SDP, ICE, etc.)
} 