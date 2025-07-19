package com.qwadwocodes.orbixa.features.chat.service;

import org.springframework.web.multipart.MultipartFile;

import com.qwadwocodes.orbixa.features.chat.model.MediaFile;

public interface MediaService {
    void uploadMedia(MultipartFile file);
    MediaFile uploadMediaForMessage(MultipartFile file, Long messageId);
    MediaFile getMedia(Long mediaId);
    byte[] getMediaContent(Long mediaId);
    void deleteMedia(Long mediaId);
    boolean isValidMediaType(String mimeType);
} 
