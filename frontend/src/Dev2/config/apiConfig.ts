// API Configuration with multiple fallback options
// This will try different IP addresses automatically

import Constants from 'expo-constants';

const POSSIBLE_IPS = [
    '4', '4', '4', '4',
    '10.0.2.2',         // Android emulator default
    'localhost',        // Local development
    '127.0.0.1'         // Loopback
];

// This will be replaced by the setup-network.js script
const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL || 'http://localhost:8080';

export const API_CONFIG = {
    BASE_URL: API_BASE_URL,
    // API endpoints
    AUTH: {
        REQUEST_OTP: '/api/auth/request-otp',
        VERIFY_OTP: '/api/auth/verify-otp'
    },
    
    CHAT: {
        MESSAGES: '/api/chat/messages',
        CONVERSATIONS: '/api/chat/conversations'
    },
    
    CONTACTS: {
        SYNC: '/api/contacts/sync',
        LIST: '/api/contacts',
        SEARCH: '/api/users/search'
    },
    
    SEARCH: {
        MESSAGES: '/api/search/messages'
    }
};

// Function to detect the working API URL
function detectApiUrl(): string {
    // Use the working IP as primary
    return API_BASE_URL;
}

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Function to test API connectivity
export const testApiConnection = async (): Promise<string | null> => {
    for (const ip of POSSIBLE_IPS) {
        try {
            const testUrl = `http://${ip}:8080/api/auth/request-otp`;
            const response = await fetch(testUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: 'test' })
            });
            
            if (response.status !== 404) { // 404 means endpoint exists but wrong method
                return ip;
            }
        } catch (error) {
            // Continue to next IP
        }
    }
    return null;
};

export default {
  baseUrl: Constants.expoConfig?.extra?.API_BASE_URL || 'http://localhost:8080',
}; 