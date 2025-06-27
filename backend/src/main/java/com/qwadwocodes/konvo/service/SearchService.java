package com.qwadwocodes.konvo.service;

import com.qwadwocodes.konvo.dto.MessageDto;
import com.qwadwocodes.konvo.dto.UserDto;
import com.qwadwocodes.konvo.model.Channel;
import com.qwadwocodes.konvo.model.ChatGroup;
import com.qwadwocodes.konvo.model.Message;
import com.qwadwocodes.konvo.model.User;
import com.qwadwocodes.konvo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ChatGroupRepository chatGroupRepository;
    private final ChannelRepository channelRepository;

    @Transactional(readOnly = true)
    public Page<MessageDto> searchAllMessages(String query, Pageable pageable) {
        return messageRepository.searchAllMessages(query, pageable)
                .map(MessageDto::new);
    }

    @Transactional(readOnly = true)
    public Page<MessageDto> searchMessagesInConversation(String conversationId, String query, Pageable pageable) {
        return messageRepository.searchMessagesInConversation(conversationId, query, pageable)
                .map(MessageDto::new);
    }

    @Transactional(readOnly = true)
    public Page<MessageDto> searchMessagesInGroup(Long groupId, String query, Pageable pageable) {
        return messageRepository.searchMessagesInGroup(groupId, query, pageable)
                .map(MessageDto::new);
    }

    @Transactional(readOnly = true)
    public Page<MessageDto> searchMessagesInChannel(Long channelId, String query, Pageable pageable) {
        return messageRepository.searchMessagesInChannel(channelId, query, pageable)
                .map(MessageDto::new);
    }

    @Transactional(readOnly = true)
    public List<UserDto> searchUsers(String query) {
        return userRepository.searchUsers(query)
                .stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ChatGroup> searchGroups(String query, Pageable pageable) {
        return chatGroupRepository.searchGroups(query, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Channel> searchChannels(String query, Pageable pageable) {
        return channelRepository.searchChannels(query, pageable);
    }
} 