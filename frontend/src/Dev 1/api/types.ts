// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ErrorResponse {
  message: string;
  status: number;
  timestamp: string;
}

// User Types
export interface User {
  id: number;
  firstName: string;
  lastName?: string;
  otherName?: string;
  phoneNumber: string;
  username?: string;
  profilePictureUrl?: string;
  bio?: string;
  lastSeen?: string;
  isOnline: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Auth Types
export interface AuthResponse {
  token: string;
  user: User;
}

export interface OtpRequest {
  phoneNumber: string;
  name: string;
}

export interface OtpVerificationRequest {
  phoneNumber: string;
  otp: string;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface RegisterRequest {
  phoneNumber: string;
  firstName: string;
  lastName?: string;
  otherName?: string;
  username?: string;
  password?: string;
}

// Chat Types
export interface Chat {
  id: number;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
  mediaUrl?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// Contact Types
export interface Contact {
  id: number;
  userId: number;
  contactId: number;
  contact: User;
  nickname?: string;
  createdAt: string;
}

// Call Types
export interface Call {
  id: number;
  callerId: number;
  receiverId: number;
  callType: 'VOICE' | 'VIDEO';
  status: 'INCOMING' | 'ONGOING' | 'COMPLETED' | 'MISSED' | 'REJECTED';
  duration?: number;
  startTime: string;
  endTime?: string;
}

// Settings Types
export interface UserSettings {
  id: number;
  userId: number;
  notifications: boolean;
  darkMode: boolean;
  language: string;
  privacy: {
    lastSeen: 'EVERYONE' | 'CONTACTS' | 'NOBODY';
    profilePhoto: 'EVERYONE' | 'CONTACTS' | 'NOBODY';
    status: 'EVERYONE' | 'CONTACTS' | 'NOBODY';
  };
  createdAt: string;
  updatedAt: string;
}

// Search Types
export interface SearchResult {
  users: User[];
  chats: Chat[];
  messages: Message[];
}

// Media Types
export interface MediaUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// Pagination Types
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
}

// WebSocket Types
export interface WebSocketMessage {
  type: 'MESSAGE' | 'TYPING' | 'ONLINE_STATUS' | 'CALL_REQUEST' | 'CALL_ACCEPT' | 'CALL_REJECT' | 'CALL_END';
  data: any;
  timestamp: string;
}

export interface TypingIndicator {
  chatId: number;
  userId: number;
  isTyping: boolean;
}

export interface OnlineStatus {
  userId: number;
  isOnline: boolean;
  lastSeen?: string;
} 