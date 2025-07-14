package com.qwadwocodes.konvo.service;

import com.qwadwocodes.konvo.dto.*;
import com.qwadwocodes.konvo.model.*;
import com.qwadwocodes.konvo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final MessageRepository messageRepository;
    private final ChatGroupRepository chatGroupRepository;
    private final UserRepository userRepository;
    private final GroupUserSettingsRepository groupUserSettingsRepository;

    @Transactional
    public MessageDto sendMessage(SendMessageDto dto, UserDetails userDetails) {
        User sender = userRepository.findByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        ChatGroup group = chatGroupRepository.findById(dto.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));
        Message replyTo = null;
        if (dto.getReplyToMessageId() != null) {
            replyTo = messageRepository.findById(dto.getReplyToMessageId())
                    .orElse(null);
        }
        Message message = new Message();
        message.setSender(sender);
        message.setGroup(group);
        message.setContent(dto.getContent());
        message.setMessageType(Message.MessageType.valueOf(dto.getType().toUpperCase()));
        message.setReplyTo(replyTo);
        message.setCreatedAt(LocalDateTime.now());
        message.setUpdatedAt(LocalDateTime.now());
        message = messageRepository.save(message);
        return toMessageDto(message, sender);
    }

    public List<MessageDto> getMessages(Long groupId, UserDetails userDetails) {
        User user = userRepository.findByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        ChatGroup group = chatGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        return messageRepository.findByGroup(group).stream()
                .map(m -> toMessageDto(m, user))
                .collect(Collectors.toList());
    }

    public List<GroupDto> getUserGroups(UserDetails userDetails) {
        User user = userRepository.findByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return chatGroupRepository.findByMembersContaining(user).stream()
                .map(this::toGroupDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public GroupDto createGroup(CreateGroupDto dto, UserDetails userDetails) {
        User creator = userRepository.findByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Set<User> members = new HashSet<>(userRepository.findAllById(dto.getMemberIds()));
        members.add(creator);
        ChatGroup group = new ChatGroup();
        group.setName(dto.getGroupName());
        group.setGroupPictureUrl(dto.getGroupImageUrl());
        group.setCreator(creator);
        group.setMembers(members);
        group.setAdmins(Set.of(creator));
        group.setCreatedAt(LocalDateTime.now());
        group.setUpdatedAt(LocalDateTime.now());
        group = chatGroupRepository.save(group);
        return toGroupDto(group);
    }

    public List<MessageDto> getSavedMessages(UserDetails userDetails) {
        User user = userRepository.findByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return messageRepository.findBySavedBy(user).stream()
                .map(m -> toMessageDto(m, user))
                .collect(Collectors.toList());
    }

    @Transactional
    public void saveMessage(Long messageId, UserDetails userDetails) {
        User user = userRepository.findByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.getSavedBy().add(user);
        messageRepository.save(message);
    }

    @Transactional
    public void unsaveMessage(Long messageId, UserDetails userDetails) {
        User user = userRepository.findByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.getSavedBy().remove(user);
        messageRepository.save(message);
    }

    public List<MessageDto> getPinnedMessages(Long groupId, UserDetails userDetails) {
        User user = userRepository.findByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        ChatGroup group = chatGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        return messageRepository.findByPinnedBy(user).stream()
                .filter(m -> m.getGroup().equals(group))
                .map(m -> toMessageDto(m, user))
                .collect(Collectors.toList());
    }

    @Transactional
    public void pinMessage(Long messageId, UserDetails userDetails) {
        User user = userRepository.findByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.getPinnedBy().add(user);
        messageRepository.save(message);
    }

    @Transactional
    public void unpinMessage(Long messageId, UserDetails userDetails) {
        User user = userRepository.findByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.getPinnedBy().remove(user);
        messageRepository.save(message);
    }

    public List<MessageDto> getMediaShared(Long groupId, UserDetails userDetails) {
        User user = userRepository.findByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        ChatGroup group = chatGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        return messageRepository.findByGroupAndFileUrlIsNotNull(group).stream()
                .map(m -> toMessageDto(m, user))
                .collect(Collectors.toList());
    }

    @Transactional
    public void forwardMessage(ForwardMessageDto dto, UserDetails userDetails) {
        User sender = userRepository.findByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Message original = messageRepository.findById(dto.getMessageId())
                .orElseThrow(() -> new RuntimeException("Message not found"));
        for (Long groupId : dto.getTargetGroupIds()) {
            ChatGroup group = chatGroupRepository.findById(groupId)
                    .orElseThrow(() -> new RuntimeException("Group not found: " + groupId));
            Message forwarded = new Message();
            forwarded.setSender(sender);
            forwarded.setGroup(group);
            forwarded.setContent(original.getContent());
            forwarded.setMessageType(original.getMessageType());
            forwarded.setFileUrl(original.getFileUrl());
            forwarded.setFileName(original.getFileName());
            forwarded.setFileSize(original.getFileSize());
            forwarded.setFileType(original.getFileType());
            forwarded.setIsEncrypted(original.isEncrypted());
            forwarded.setIsEdited(false);
            forwarded.setCreatedAt(LocalDateTime.now());
            forwarded.setUpdatedAt(LocalDateTime.now());
            messageRepository.save(forwarded);
        }
    }

    public ChatSettingsDto getChatSettings(Long groupId, UserDetails userDetails) {
        User user = userRepository.findByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        ChatGroup group = chatGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        GroupUserSettings settings = groupUserSettingsRepository.findByUserAndGroup(user, group)
                .orElse(new GroupUserSettings());
        ChatSettingsDto dto = new ChatSettingsDto();
        dto.setIsMuted(settings.getIsMuted());
        dto.setIsPinned(settings.getIsPinned());
        dto.setTheme(settings.getTheme());
        return dto;
    }

    @Transactional
    public void updateChatSettings(Long groupId, ChatSettingsDto dto, UserDetails userDetails) {
        User user = userRepository.findByPhoneNumber(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        ChatGroup group = chatGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        GroupUserSettings settings = groupUserSettingsRepository.findByUserAndGroup(user, group)
                .orElse(new GroupUserSettings(null, user, group, false, false, null));
        settings.setIsMuted(dto.getIsMuted());
        settings.setIsPinned(dto.getIsPinned());
        settings.setTheme(dto.getTheme());
        groupUserSettingsRepository.save(settings);
    }

    // --- Helper mappers ---
    private MessageDto toMessageDto(Message m, User user) {
        MessageDto dto = new MessageDto();
        dto.setId(m.getId());
        dto.setGroupId(m.getGroup() != null ? m.getGroup().getId() : null);
        dto.setSenderId(m.getSender().getId());
        dto.setContent(m.getContent());
        dto.setType(m.getMessageType().name());
        dto.setSentAt(m.getCreatedAt() != null ? java.sql.Timestamp.valueOf(m.getCreatedAt()) : null);
        dto.setIsPinned(m.getPinnedBy().contains(user));
        dto.setIsSaved(m.getSavedBy().contains(user));
        dto.setMediaUrl(m.getFileUrl());
        return dto;
    }

    private GroupDto toGroupDto(ChatGroup g) {
        GroupDto dto = new GroupDto();
        dto.setId(g.getId());
        dto.setName(g.getName());
        dto.setMemberIds(g.getMembers().stream().map(User::getId).collect(Collectors.toList()));
        dto.setImageUrl(g.getGroupPictureUrl());
        return dto;
    }
} 