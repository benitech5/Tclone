package com.qwadwocodes.orbixa.features.chat.controller;

import com.qwadwocodes.orbixa.features.chat.model.CallRecord;
import com.qwadwocodes.orbixa.features.chat.service.CallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/calls")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CallController {
    
    private final CallService callService;

    @GetMapping("/history")
    public ResponseEntity<List<CallRecord>> getCallHistory() {
        List<CallRecord> calls = callService.getCallHistory();
        return ResponseEntity.ok(calls);
    }

    @GetMapping("/history/user/{userId}")
    public ResponseEntity<List<CallRecord>> getCallHistoryByUser(@PathVariable Long userId) {
        List<CallRecord> calls = callService.getCallHistoryByUser(userId);
        return ResponseEntity.ok(calls);
    }

    @GetMapping("/history/user/{userId}/missed")
    public ResponseEntity<List<CallRecord>> getMissedCalls(@PathVariable Long userId) {
        List<CallRecord> calls = callService.getMissedCalls(userId);
        return ResponseEntity.ok(calls);
    }

    @GetMapping("/history/user/{userId}/outgoing")
    public ResponseEntity<List<CallRecord>> getOutgoingCalls(@PathVariable Long userId) {
        List<CallRecord> calls = callService.getOutgoingCalls(userId);
        return ResponseEntity.ok(calls);
    }

    @GetMapping("/history/user/{userId}/incoming")
    public ResponseEntity<List<CallRecord>> getIncomingCalls(@PathVariable Long userId) {
        List<CallRecord> calls = callService.getIncomingCalls(userId);
        return ResponseEntity.ok(calls);
    }

    @PostMapping("/initiate")
    public ResponseEntity<Void> initiateCall(@RequestBody CallRecord callRecord) {
        callService.initiateCall(callRecord);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{callId}/accept")
    public ResponseEntity<Void> acceptCall(@PathVariable Long callId) {
        callService.acceptCall(callId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{callId}/reject")
    public ResponseEntity<Void> rejectCall(@PathVariable Long callId) {
        callService.rejectCall(callId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{callId}/end")
    public ResponseEntity<Void> endCall(@PathVariable Long callId) {
        callService.endCall(callId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{callId}/mute")
    public ResponseEntity<Void> muteCall(@PathVariable Long callId, @RequestParam boolean muted) {
        callService.muteCall(callId, muted);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{callId}/hold")
    public ResponseEntity<Void> holdCall(@PathVariable Long callId, @RequestParam boolean onHold) {
        callService.holdCall(callId, onHold);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{callId}")
    public ResponseEntity<CallRecord> getCallById(@PathVariable Long callId) {
        CallRecord call = callService.getCallById(callId);
        return ResponseEntity.ok(call);
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<Optional<CallRecord>> getActiveCall(@PathVariable Long userId) {
        Optional<CallRecord> call = callService.getActiveCall(userId);
        return ResponseEntity.ok(call);
    }

    @GetMapping("/user/{userId}/in-call")
    public ResponseEntity<Boolean> isUserInCall(@PathVariable Long userId) {
        boolean inCall = callService.isUserInCall(userId);
        return ResponseEntity.ok(inCall);
    }

    @DeleteMapping("/{callId}")
    public ResponseEntity<Void> deleteCallRecord(@PathVariable Long callId) {
        callService.deleteCallRecord(callId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/group/{chatId}")
    public ResponseEntity<Void> initiateGroupCall(
            @PathVariable Long chatId,
            @RequestParam Long callerId,
            @RequestParam String type) {
        
        CallRecord.CallType callType = CallRecord.CallType.valueOf(type.toUpperCase());
        callService.initiateGroupCall(chatId, callerId, callType);
        return ResponseEntity.ok().build();
    }
} 
