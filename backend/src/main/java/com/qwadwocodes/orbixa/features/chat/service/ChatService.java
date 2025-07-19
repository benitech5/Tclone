package com.qwadwocodes.orbixa.features.chat.service;

import java.util.List;

import com.qwadwocodes.orbixa.features.chat.model.Chat;
import com.qwadwocodes.orbixa.features.chat.model.ChatMember;

public interface ChatService {
    List<Chat> getChats();
    void createChat(Chat chat);
    Chat getChat(Long chatId);
    void updateChat(Long chatId, Chat chat);
    void deleteChat(Long chatId);
    List<Chat> getChatsForUser(Long userId);
    void addMemberToChat(Long chatId, Long userId, ChatMember.Role role);
    void removeMemberFromChat(Long chatId, Long userId);
    List<Long> getChatMemberIds(Long chatId);
} 
