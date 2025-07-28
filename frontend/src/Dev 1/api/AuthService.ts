import axios from 'axios';
import { API_ENDPOINTS } from './config';

// Request OTP for phone number verification
export const requestOtp = async (phoneNumber: string, name: string) => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.AUTH}/request-otp`, { 
      phoneNumber, 
      name 
    });
    return response.data;
  } catch (error) {
    console.error('Error requesting OTP:', error);
    throw error;
  }
};

// Verify OTP and get authentication token
export const verifyOtp = async (phoneNumber: string, otp: string) => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.AUTH}/verify-otp`, { 
      phoneNumber, 
      otp 
    });
    return response.data; // This should contain the token and user info
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

// Register new user
export const registerUser = async (email: string, phone: string, password: string) => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.AUTH}/register`, { 
      email, 
      phone, 
      password 
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login with credentials
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.AUTH}/login`, { 
      email, 
      password 
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Logout user
export const logout = async (token: string) => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.AUTH}/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Refresh access token
export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.AUTH}/refresh`, { 
      refreshToken 
    });
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// Get current user profile
export const getCurrentUser = async (token: string) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.USER}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (token: string, userData: any) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.USER}/me`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Check if user exists by phone number
export const checkUserExists = async (phoneNumber: string) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.USER}/phone/${phoneNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error checking user existence:', error);
    throw error;
  }
};

// Create new user profile
export const createUserProfile = async (userData: any) => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.USER}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};
