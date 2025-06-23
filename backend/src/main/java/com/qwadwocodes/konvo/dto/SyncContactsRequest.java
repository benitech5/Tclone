package com.qwadwocodes.konvo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SyncContactsRequest {
    private List<String> phoneNumbers;
} 