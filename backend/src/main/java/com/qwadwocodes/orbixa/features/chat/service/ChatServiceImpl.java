package com.qwadwocodes.orbixa.features.chat.service;

import com.qwadwocodes.orbixa.features.chat.model.Chat;
import com.qwadwocodes.orbixa.features.chat.model.ChatMember;
import com.qwadwocodes.orbixa.features.chat.model.ChatMemberId;
import com.qwadwocodes.orbixa.features.chat.repository.ChatRepository;
import com.qwadwocodes.orbixa.features.chat.repository.ChatMemberRepository;
import com.qwadwocodes.orbixa.features.profile.model.User;
import com.qwadwocodes.orbixa.features.profile.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final ChatMemberRepository chatMemberRepository;
    private final UserRepository userRepository;

    public ChatServiceImpl(ChatRepository chatRepository, 
                          ChatMemberRepository chatMemberRepository,
                          UserRepository userRepository) {
        this.chatRepository = chatRepository;
        this.chatMemberRepository = chatMemberRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Chat> getChats() {
        return chatRepository.findAll();
    }

    @Override
    public void createChat(Chat chat) {
        // Set creation timestamp
        chat.setCreatedAt(LocalDateTime.now());
        
        // Generate invite link for public chats
        if (chat.isPublic()) {
            chat.setInviteLink(generateInviteLink());
        }
        
        // Save the chat
        Chat savedChat = chatRepository.save(chat);
        
        // If it's a group or channel, add the creator as admin
        if (chat.getType() != Chat.ChatType.PRIVATE) {
            // TODO: Get current user from security context
            // For now, we'll need to pass the creator ID
            // addMemberToChat(savedChat.getId(), creatorId, ChatMember.Role.ADMIN);
        }
    }

    @Override
    public Chat getChat(Long chatId) {
        return chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found with id: " + chatId));
    }

    @Override
    public void updateChat(Long chatId, Chat chat) {
        Chat existingChat = getChat(chatId);
        
        // Update fields
        existingChat.setTitle(chat.getTitle());
        existingChat.setDescription(chat.getDescription());
        existingChat.setPhotoUrl(chat.getPhotoUrl());
        existingChat.setPublic(chat.isPublic());
        
        // Generate new invite link if making public
        if (chat.isPublic() && existingChat.getInviteLink() == null) {
            existingChat.setInviteLink(generateInviteLink());
        }
        
        chatRepository.save(existingChat);
    }

    @Override
    public void deleteChat(Long chatId) {
        Chat chat = getChat(chatId);
        
        // Delete all chat members first
        // TODO: Implement bulk delete for chat members
        
        // Delete the chat
        chatRepository.delete(chat);
    }

    // Helper methods
    private String generateInviteLink() {
        return "https://orbixa.app/join/" + UUID.randomUUID().toString();
    }

    public List<Chat> getChatsForUser(Long userId) {
        // TODO: Implement query to get chats where user is a member
        // This would require a custom repository method
        return chatRepository.findAll();
    }

    @Override
    public void addMemberToChat(Long chatId, Long userId, ChatMember.Role role) {
        Chat chat = getChat(chatId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        ChatMember member = new ChatMember();
        member.setChatId(chatId);
        member.setUserId(userId);
        member.setRole(role);
        member.setJoinedAt(LocalDateTime.now());
        
        chatMemberRepository.save(member);
    }

    @Override
    public void removeMemberFromChat(Long chatId, Long userId) {
        // TODO: Implement member removal
        // This would require a custom query or using the composite key
        ChatMember member = chatMemberRepository.findById(new ChatMemberId(chatId, userId))
                .orElseThrow(() -> new RuntimeException("Chat member not found"));
        chatMemberRepository.delete(member);
    }

    @Override
    public List<Long> getChatMemberIds(Long chatId) {
        // TODO: Implement query to get member IDs for a chat
        // This would require a custom repository method
        return chatMemberRepository.findByChatId(chatId).stream()
                .map(ChatMember::getUserId)
                .toList();
    }
} 
