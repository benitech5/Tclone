-- Test data for H2 database

-- Insert test users
INSERT INTO users (id, phone_number, first_name, last_name, password, profile_picture_url, created_at, updated_at) 
VALUES 
(1, '+1234567890', 'John', 'Doe', '$2a$10$test', 'https://example.com/avatar1.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, '+1234567891', 'Jane', 'Smith', '$2a$10$test', 'https://example.com/avatar2.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, '+1234567892', 'Bob', 'Johnson', '$2a$10$test', 'https://example.com/avatar3.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test chats
INSERT INTO chats (id, name, chat_type, created_at, updated_at) 
VALUES 
(1, 'Test Group Chat', 'GROUP', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Direct Chat', 'DIRECT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test chat members
INSERT INTO chat_members (chat_id, user_id, role, joined_at) 
VALUES 
(1, 1, 'ADMIN', CURRENT_TIMESTAMP),
(1, 2, 'MEMBER', CURRENT_TIMESTAMP),
(2, 1, 'MEMBER', CURRENT_TIMESTAMP),
(2, 2, 'MEMBER', CURRENT_TIMESTAMP);

-- Insert test messages
INSERT INTO messages (id, chat_id, sender_id, content, message_type, timestamp, is_edited, is_deleted, is_pinned) 
VALUES 
(1, 1, 1, 'Hello everyone!', 'TEXT', CURRENT_TIMESTAMP, false, false, false),
(2, 1, 2, 'Hi John!', 'TEXT', CURRENT_TIMESTAMP, false, false, false),
(3, 2, 1, 'Private message', 'TEXT', CURRENT_TIMESTAMP, false, false, false);

-- Insert test contacts
INSERT INTO contacts (owner_id, contact_id, alias, created_at) 
VALUES 
(1, 2, 'Jane', CURRENT_TIMESTAMP),
(2, 1, 'John', CURRENT_TIMESTAMP);

-- Insert test settings
INSERT INTO settings (user_id, setting_key, setting_value, created_at, updated_at) 
VALUES 
(1, 'notifications_enabled', 'true', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'theme', 'dark', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'notifications_enabled', 'false', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); 