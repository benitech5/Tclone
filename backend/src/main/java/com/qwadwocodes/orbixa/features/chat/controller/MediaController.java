package com.qwadwocodes.orbixa.features.chat.controller;

import com.qwadwocodes.orbixa.features.chat.model.MediaFile;
import com.qwadwocodes.orbixa.features.chat.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MediaController {
    
    private final MediaService mediaService;

    @PostMapping("/upload")
    public ResponseEntity<Void> uploadMedia(@RequestParam MultipartFile file) {
        mediaService.uploadMedia(file);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/upload/message/{messageId}")
    public ResponseEntity<MediaFile> uploadMediaForMessage(
            @PathVariable Long messageId,
            @RequestParam MultipartFile file) {
        
        MediaFile mediaFile = mediaService.uploadMediaForMessage(file, messageId);
        return ResponseEntity.ok(mediaFile);
    }

    @GetMapping("/{mediaId}")
    public ResponseEntity<MediaFile> getMedia(@PathVariable Long mediaId) {
        MediaFile mediaFile = mediaService.getMedia(mediaId);
        return ResponseEntity.ok(mediaFile);
    }

    @GetMapping("/{mediaId}/content")
    public ResponseEntity<ByteArrayResource> getMediaContent(@PathVariable Long mediaId) {
        MediaFile mediaFile = mediaService.getMedia(mediaId);
        byte[] content = mediaService.getMediaContent(mediaId);
        
        ByteArrayResource resource = new ByteArrayResource(content);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + mediaFile.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(mediaFile.getMimeType()))
                .body(resource);
    }

    @DeleteMapping("/{mediaId}")
    public ResponseEntity<Void> deleteMedia(@PathVariable Long mediaId) {
        mediaService.deleteMedia(mediaId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateMediaType(@RequestParam String mimeType) {
        boolean isValid = mediaService.isValidMediaType(mimeType);
        return ResponseEntity.ok(isValid);
    }
} 
