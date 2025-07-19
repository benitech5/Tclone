package com.qwadwocodes.orbixa.features.contacts.service;

import java.util.List;

import com.qwadwocodes.orbixa.features.contacts.model.Contact;
import com.qwadwocodes.orbixa.features.profile.model.User;

public interface ContactService {
    List<Contact> getContacts();
    List<Contact> getContactsByOwner(Long ownerId);
    List<User> getContactUsers(Long ownerId);
    void addContact(Contact contact);
    void removeContact(Long ownerId, Long contactId);
    void updateContactAlias(Long ownerId, Long contactId, String newAlias);
    boolean isContact(Long ownerId, Long contactId);
} 
