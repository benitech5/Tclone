import axios from 'axios';

// IMPORTANT: Replace with your laptop's local IP address for mobile testing
// Example in AuthService.ts
const API_BASE_URL = 'http://192.168.188.18:8082'; // <-- Set this to your laptop's IP
const API_URL = `${API_BASE_URL}/api/auth`;

export const requestOtp = async (phoneNumber: string, name: string) => {
    return axios.post(`${API_URL}/request-otp`, { phoneNumber, name });
};

export const verifyOtp = async (phoneNumber: string, otp: string) => {
    const response = await axios.post(`${API_URL}/verify-otp`, { phoneNumber, otp });
    return response.data; // This should contain the token
};

export const registerUser = async (email: string, phone: string, password: string) => {
    return axios.post(`${API_URL}/register`, { email, phone, password });
};
