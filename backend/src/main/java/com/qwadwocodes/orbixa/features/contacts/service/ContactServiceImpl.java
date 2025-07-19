package com.qwadwocodes.orbixa.features.contacts.service;

import com.qwadwocodes.orbixa.features.contacts.model.Contact;
import com.qwadwocodes.orbixa.features.contacts.model.ContactId;
import com.qwadwocodes.orbixa.features.contacts.repository.ContactRepository;
import com.qwadwocodes.orbixa.features.profile.model.User;
import com.qwadwocodes.orbixa.features.profile.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    public ContactServiceImpl(ContactRepository contactRepository, 
                            UserRepository userRepository) {
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Contact> getContacts() {
        return contactRepository.findAll();
    }

    @Override
    public void addContact(Contact contact) {
        // Validate that both owner and contact exist
        User owner = userRepository.findById(contact.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found with id: " + contact.getOwnerId()));
        
        User contactUser = userRepository.findById(contact.getContactId())
                .orElseThrow(() -> new RuntimeException("Contact user not found with id: " + contact.getContactId()));

        // Check if contact already exists
        ContactId contactId = new ContactId(contact.getOwnerId(), contact.getContactId());
        if (contactRepository.existsById(contactId)) {
            throw new RuntimeException("Contact already exists");
        }

        // Prevent self-contact
        if (contact.getOwnerId().equals(contact.getContactId())) {
            throw new RuntimeException("Cannot add yourself as a contact");
        }

        // Set default alias if not provided
        if (contact.getAlias() == null || contact.getAlias().trim().isEmpty()) {
            contact.setAlias(contactUser.getFirstName());
        }

        contactRepository.save(contact);
    }

    @Override
    public void removeContact(Long ownerId, Long contactId) {
        ContactId id = new ContactId(ownerId, contactId);
        if (!contactRepository.existsById(id)) {
            throw new RuntimeException("Contact not found");
        }
        contactRepository.deleteById(id);
    }

    @Override
    public List<Contact> getContactsByOwner(Long ownerId) {
        // TODO: Implement custom query in repository
        return contactRepository.findAll().stream()
                .filter(contact -> contact.getOwnerId().equals(ownerId))
                .collect(Collectors.toList());
    }

    @Override
    public void updateContactAlias(Long ownerId, Long contactId, String newAlias) {
        ContactId id = new ContactId(ownerId, contactId);
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        
        contact.setAlias(newAlias);
        contactRepository.save(contact);
    }

    @Override
    public boolean isContact(Long ownerId, Long contactId) {
        ContactId id = new ContactId(ownerId, contactId);
        return contactRepository.existsById(id);
    }

    @Override
    public List<User> getContactUsers(Long ownerId) {
        List<Contact> contacts = getContactsByOwner(ownerId);
        return contacts.stream()
                .map(contact -> userRepository.findById(contact.getContactId()))
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .collect(Collectors.toList());
    }
} 
