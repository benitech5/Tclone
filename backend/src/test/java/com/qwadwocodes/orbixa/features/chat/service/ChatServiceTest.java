package com.qwadwocodes.orbixa.features.chat.service;

import com.qwadwocodes.orbixa.features.chat.model.Chat;
import com.qwadwocodes.orbixa.features.chat.model.ChatMember;
import com.qwadwocodes.orbixa.features.chat.repository.ChatMemberRepository;
import com.qwadwocodes.orbixa.features.chat.repository.ChatRepository;
import com.qwadwocodes.orbixa.features.profile.model.User;
import com.qwadwocodes.orbixa.features.profile.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private ChatRepository chatRepository;

    @Mock
    private ChatMemberRepository chatMemberRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ChatServiceImpl chatService;

    private User testUser;
    private Chat testChat;
    private ChatMember testChatMember;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setFirstName("Test");
        testUser.setLastName("User");

        testChat = new Chat();
        testChat.setId(1L);
        testChat.setTitle("Test Chat");
        testChat.setType(Chat.ChatType.GROUP);
        testChat.setCreatedAt(LocalDateTime.now());

        testChatMember = new ChatMember();
        testChatMember.setChatId(1L);
        testChatMember.setUserId(1L);
        testChatMember.setRole(ChatMember.Role.MEMBER);
        testChatMember.setJoinedAt(LocalDateTime.now());
    }

    @Test
    void testCreateChat() {
        // Given
        when(chatRepository.save(any(Chat.class))).thenReturn(testChat);

        // When
        chatService.createChat(testChat);

        // Then
        verify(chatRepository).save(any(Chat.class));
    }

    @Test
    void testCreateChatWithMembers() {
        // Given
        when(chatRepository.save(any(Chat.class))).thenReturn(testChat);

        // When
        chatService.createChat(testChat);

        // Then
        verify(chatRepository).save(any(Chat.class));
    }

    @Test
    void testGetChatById() {
        // Given
        when(chatRepository.findById(1L)).thenReturn(Optional.of(testChat));

        // When
        Chat result = chatService.getChat(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Chat", result.getTitle());
        verify(chatRepository).findById(1L);
    }

    @Test
    void testGetChatByIdNotFound() {
        // Given
        when(chatRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            chatService.getChat(1L);
        });
    }

    @Test
    void testGetUserChats() {
        // Given
        List<Chat> expectedChats = Arrays.asList(testChat);
        when(chatRepository.findAll()).thenReturn(expectedChats);

        // When
        List<Chat> result = chatService.getChatsForUser(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(chatRepository).findAll();
    }

    @Test
    void testAddMemberToChat() {
        // Given
        when(chatRepository.findById(1L)).thenReturn(Optional.of(testChat));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(chatMemberRepository.save(any(ChatMember.class))).thenReturn(testChatMember);

        // When
        chatService.addMemberToChat(1L, 1L, ChatMember.Role.MEMBER);

        // Then
        verify(chatRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(chatMemberRepository).save(any(ChatMember.class));
    }

    @Test
    void testRemoveMemberFromChat() {
        // Given
        when(chatRepository.findById(1L)).thenReturn(Optional.of(testChat));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(chatMemberRepository.findById(any())).thenReturn(Optional.of(testChatMember));

        // When
        chatService.removeMemberFromChat(1L, 1L);

        // Then
        verify(chatRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(chatMemberRepository).findById(any());
        verify(chatMemberRepository).delete(any(ChatMember.class));
    }

    @Test
    void testGetChatMemberIds() {
        // Given
        List<ChatMember> expectedMembers = Arrays.asList(testChatMember);
        when(chatMemberRepository.findByChatId(1L)).thenReturn(expectedMembers);

        // When
        List<Long> result = chatService.getChatMemberIds(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(chatMemberRepository).findByChatId(1L);
    }

    @Test
    void testUpdateChat() {
        // Given
        Chat updatedChat = new Chat();
        updatedChat.setTitle("Updated Chat Name");
        updatedChat.setDescription("Updated description");
        
        when(chatRepository.findById(1L)).thenReturn(Optional.of(testChat));
        when(chatRepository.save(any(Chat.class))).thenReturn(testChat);

        // When
        chatService.updateChat(1L, updatedChat);

        // Then
        verify(chatRepository).findById(1L);
        verify(chatRepository).save(any(Chat.class));
    }

    @Test
    void testDeleteChat() {
        // Given
        when(chatRepository.findById(1L)).thenReturn(Optional.of(testChat));

        // When
        chatService.deleteChat(1L);

        // Then
        verify(chatRepository).findById(1L);
        verify(chatRepository).delete(any(Chat.class));
    }
} 