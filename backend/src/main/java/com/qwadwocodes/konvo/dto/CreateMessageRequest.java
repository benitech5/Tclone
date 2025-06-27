package com.qwadwocodes.konvo.dto;

import com.qwadwocodes.konvo.model.Message;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMessageRequest {
    private Long receiverId;
    private Long groupId;
    private Long channelId;
    private String conversationId;
    private String content;
    private Message.MessageType messageType;
    private String fileUrl;
    private String fileName;
    private Long fileSize;
    private String fileType;
    private boolean isSecretChat;
    private Integer selfDestructTimer;
    private Long replyToMessageId;
    private Long forwardedFromMessageId;
} 