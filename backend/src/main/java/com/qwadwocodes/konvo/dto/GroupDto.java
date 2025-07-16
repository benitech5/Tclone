package com.qwadwocodes.konvo.dto;

import lombok.Data;
import java.util.List;

@Data
public class GroupDto {
    private Long id;
    private String name;
    private List<Long> memberIds;
    private String imageUrl; // optional
} 