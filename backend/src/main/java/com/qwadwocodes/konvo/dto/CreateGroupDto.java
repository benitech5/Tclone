package com.qwadwocodes.konvo.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateGroupDto {
    private String groupName;
    private List<Long> memberIds;
    private String groupImageUrl; // optional
} 