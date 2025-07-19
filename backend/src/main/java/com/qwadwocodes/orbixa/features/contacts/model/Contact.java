package com.qwadwocodes.orbixa.features.contacts.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(ContactId.class)
public class Contact {
    @Id
    private Long ownerId;
    @Id
    private Long contactId;
    private String alias;
} 
