package com.qwadwocodes.orbixa.features.contacts.model;

import java.io.Serializable;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactId implements Serializable {
    private Long ownerId;
    private Long contactId;
} 
