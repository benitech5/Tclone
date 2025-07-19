package com.qwadwocodes.orbixa.features.contacts.repository;

import com.qwadwocodes.orbixa.features.contacts.model.Contact;
import com.qwadwocodes.orbixa.features.contacts.model.ContactId;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, ContactId> {
} 
