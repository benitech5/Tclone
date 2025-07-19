package com.qwadwocodes.orbixa.features.chat.service;

import java.util.List;

import com.qwadwocodes.orbixa.features.chat.model.Message;

public interface MessageService {
    List<Message> getMessages(Long chatId);
    void sendMessage(Long chatId, Message message);
    void editMessage(Long messageId, Message message);
    void deleteMessage(Long messageId);
    void replyToMessage(Long messageId, Message reply);
    void reactToMessage(Long messageId, String reaction);
    List<Message> getMessagesByUser(Long userId);
    List<Message> getSavedMessages(Long userId);
    List<Message> getPinnedMessages(Long userId);
    void saveMessage(Long messageId, Long userId);
    void pinMessage(Long messageId, Long userId);
} 
