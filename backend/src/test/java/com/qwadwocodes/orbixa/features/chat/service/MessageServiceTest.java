package com.qwadwocodes.orbixa.features.chat.service;

import com.qwadwocodes.orbixa.features.chat.model.Chat;
import com.qwadwocodes.orbixa.features.chat.model.Message;
import com.qwadwocodes.orbixa.features.chat.repository.MessageRepository;
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
class MessageServiceTest {

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private MessageServiceImpl messageService;

    private User testUser;
    private Chat testChat;
    private Message testMessage;

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

        testMessage = new Message();
        testMessage.setId(1L);
        testMessage.setSender(testUser);
        testMessage.setChat(testChat);
        testMessage.setContent("Test message");
        testMessage.setMessageType(Message.MessageType.TEXT);
        testMessage.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void testSendMessage() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(messageRepository.save(any(Message.class))).thenReturn(testMessage);

        // When
        messageService.sendMessage(1L, testMessage);

        // Then
        verify(messageRepository).save(any(Message.class));
        verify(userRepository).findById(1L);
    }

    @Test
    void testSendMessageWithNullSender() {
        // Given
        testMessage.setSender(null);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            messageService.sendMessage(1L, testMessage);
        });
    }

    @Test
    void testGetMessages() {
        // Given
        List<Message> expectedMessages = Arrays.asList(testMessage);
        when(messageRepository.findAll()).thenReturn(expectedMessages);

        // When
        List<Message> result = messageService.getMessages(1L);

        // Then
        assertEquals(expectedMessages, result);
        verify(messageRepository).findAll();
    }

    @Test
    void testEditMessage() {
        // Given
        Message updatedMessage = new Message();
        updatedMessage.setContent("Updated content");
        updatedMessage.setFileUrl("new-file-url");

        when(messageRepository.findById(1L)).thenReturn(Optional.of(testMessage));
        when(messageRepository.save(any(Message.class))).thenReturn(testMessage);

        // When
        messageService.editMessage(1L, updatedMessage);

        // Then
        verify(messageRepository).findById(1L);
        verify(messageRepository).save(any(Message.class));
    }

    @Test
    void testEditMessageNotFound() {
        // Given
        when(messageRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            messageService.editMessage(1L, testMessage);
        });
    }

    @Test
    void testDeleteMessage() {
        // Given
        when(messageRepository.findById(1L)).thenReturn(Optional.of(testMessage));
        when(messageRepository.save(any(Message.class))).thenReturn(testMessage);

        // When
        messageService.deleteMessage(1L);

        // Then
        verify(messageRepository).findById(1L);
        verify(messageRepository).save(any(Message.class));
        assertNotNull(testMessage.getDeletedAt());
    }

    @Test
    void testDeleteMessageNotFound() {
        // Given
        when(messageRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            messageService.deleteMessage(1L);
        });
    }

    @Test
    void testReplyToMessage() {
        // Given
        Message reply = new Message();
        reply.setSender(testUser);
        reply.setContent("Reply message");

        when(messageRepository.findById(1L)).thenReturn(Optional.of(testMessage));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(messageRepository.save(any(Message.class))).thenReturn(reply);

        // When
        messageService.replyToMessage(1L, reply);

        // Then
        verify(messageRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(messageRepository).save(any(Message.class));
        assertEquals(testMessage, reply.getReplyTo());
    }

    @Test
    void testReplyToMessageNotFound() {
        // Given
        when(messageRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            messageService.replyToMessage(1L, testMessage);
        });
    }

    @Test
    void testReactToMessage() {
        // Given
        when(messageRepository.findById(1L)).thenReturn(Optional.of(testMessage));

        // When
        messageService.reactToMessage(1L, "👍");

        // Then
        verify(messageRepository).findById(1L);
    }

    @Test
    void testReactToMessageNotFound() {
        // Given
        when(messageRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            messageService.reactToMessage(1L, "👍");
        });
    }

    @Test
    void testGetMessagesByUser() {
        // Given
        List<Message> expectedMessages = Arrays.asList(testMessage);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(messageRepository.findBySender(testUser)).thenReturn(expectedMessages);

        // When
        List<Message> result = messageService.getMessagesByUser(1L);

        // Then
        assertEquals(expectedMessages, result);
        verify(userRepository).findById(1L);
        verify(messageRepository).findBySender(testUser);
    }

    @Test
    void testSaveMessage() {
        // Given
        when(messageRepository.findById(1L)).thenReturn(Optional.of(testMessage));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(messageRepository.save(any(Message.class))).thenReturn(testMessage);

        // When
        messageService.saveMessage(1L, 1L);

        // Then
        verify(messageRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(messageRepository).save(any(Message.class));
    }

    @Test
    void testPinMessage() {
        // Given
        when(messageRepository.findById(1L)).thenReturn(Optional.of(testMessage));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(messageRepository.save(any(Message.class))).thenReturn(testMessage);

        // When
        messageService.pinMessage(1L, 1L);

        // Then
        verify(messageRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(messageRepository).save(any(Message.class));
    }
} 