package com.qwadwocodes.orbixa.features.chat.service;

import com.qwadwocodes.orbixa.features.chat.model.MediaFile;
import com.qwadwocodes.orbixa.features.chat.repository.MediaFileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class MediaServiceImpl implements MediaService {

    private final MediaFileRepository mediaFileRepository;
    private final String uploadDir = "uploads/"; // TODO: Make this configurable

    public MediaServiceImpl(MediaFileRepository mediaFileRepository) {
        this.mediaFileRepository = mediaFileRepository;
        // Create upload directory if it doesn't exist
        createUploadDirectory();
    }

    @Override
    public void uploadMedia(MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // Create file path
            Path filePath = Paths.get(uploadDir + uniqueFilename);

            // Save file to disk
            Files.copy(file.getInputStream(), filePath);

            // Create media file record
            MediaFile mediaFile = new MediaFile();
            mediaFile.setFileName(originalFilename);
            mediaFile.setUrl("/media/" + uniqueFilename); // URL for accessing the file
            mediaFile.setMimeType(file.getContentType());
            mediaFile.setSize(file.getSize());
            mediaFile.setUploadedAt(LocalDateTime.now());

            // Save to database
            mediaFileRepository.save(mediaFile);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage(), e);
        }
    }

    @Override
    public MediaFile getMedia(Long mediaId) {
        return mediaFileRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media file not found with id: " + mediaId));
    }

    @Override
    public void deleteMedia(Long mediaId) {
        MediaFile mediaFile = getMedia(mediaId);
        
        try {
            // Extract filename from URL
            String url = mediaFile.getUrl();
            String filename = url.substring(url.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir + filename);
            
            // Delete file from disk
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
            
            // Delete from database
            mediaFileRepository.delete(mediaFile);
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete media file: " + e.getMessage(), e);
        }
    }

    // Helper methods
    private void createUploadDirectory() {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory: " + e.getMessage(), e);
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }

    public MediaFile uploadMediaForMessage(MultipartFile file, Long messageId) {
        try {
            // Validate file
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // Create file path
            Path filePath = Paths.get(uploadDir + uniqueFilename);

            // Save file to disk
            Files.copy(file.getInputStream(), filePath);

            // Create media file record
            MediaFile mediaFile = new MediaFile();
            mediaFile.setMessageId(messageId);
            mediaFile.setFileName(originalFilename);
            mediaFile.setUrl("/media/" + uniqueFilename);
            mediaFile.setMimeType(file.getContentType());
            mediaFile.setSize(file.getSize());
            mediaFile.setUploadedAt(LocalDateTime.now());

            // Save to database
            return mediaFileRepository.save(mediaFile);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage(), e);
        }
    }

    public byte[] getMediaContent(Long mediaId) {
        MediaFile mediaFile = getMedia(mediaId);
        
        try {
            String url = mediaFile.getUrl();
            String filename = url.substring(url.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir + filename);
            
            if (!Files.exists(filePath)) {
                throw new RuntimeException("Media file not found on disk: " + filename);
            }
            
            return Files.readAllBytes(filePath);
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to read media file: " + e.getMessage(), e);
        }
    }

    public boolean isValidMediaType(String mimeType) {
        // Define allowed media types
        String[] allowedTypes = {
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "video/mp4", "video/avi", "video/mov", "video/wmv",
            "audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3",
            "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        };
        
        for (String allowedType : allowedTypes) {
            if (allowedType.equals(mimeType)) {
                return true;
            }
        }
        return false;
    }
} 
