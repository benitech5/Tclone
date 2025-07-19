package com.qwadwocodes.orbixa.features.chat.service;

import com.qwadwocodes.orbixa.features.chat.model.CallRecord;
import java.util.List;
import java.util.Optional;

public interface CallService {
    List<CallRecord> getCallHistory();
    List<CallRecord> getCallHistoryByUser(Long userId);
    List<CallRecord> getMissedCalls(Long userId);
    List<CallRecord> getOutgoingCalls(Long userId);
    List<CallRecord> getIncomingCalls(Long userId);
    void initiateCall(CallRecord callRecord);
    void endCall(Long callId);
    void acceptCall(Long callId);
    void rejectCall(Long callId);
    void muteCall(Long callId, boolean muted);
    void holdCall(Long callId, boolean onHold);
    Optional<CallRecord> getActiveCall(Long userId);
    boolean isUserInCall(Long userId);
    void updateCallDuration(Long callId);
    CallRecord getCallById(Long callId);
    void deleteCallRecord(Long callId);
    void initiateGroupCall(Long chatId, Long callerId, CallRecord.CallType callType);
} 
