import axios from 'axios';
import { API_ENDPOINTS } from './config';
import {
  User,
  AuthResponse,
  OtpRequest,
  OtpVerificationRequest,
  LoginRequest,
  RegisterRequest,
  ApiResponse,
  ErrorResponse
} from './types';

// Request OTP for phone number verification
export const requestOtp = async (phoneNumber: string, name: string): Promise<void> => {
  const response = await axios.post(`${API_ENDPOINTS.AUTH}/request-otp`, { 
    phoneNumber, 
    name 
  });
  return response.data;
};

// Verify OTP and get authentication token
export const verifyOtp = async (phoneNumber: string, otp: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_ENDPOINTS.AUTH}/verify-otp`, { 
    phoneNumber, 
    otp 
  });
  return response.data;
};

// Login with phone number and password
export const login = async (phoneNumber: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_ENDPOINTS.AUTH}/login`, { 
    phoneNumber, 
    password 
  });
  return response.data;
};

// Register new user
export const registerUser = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const response = await axios.post(`${API_ENDPOINTS.AUTH}/register`, userData);
  return response.data;
};

// Logout user
export const logout = async (token: string): Promise<void> => {
  await axios.post(`${API_ENDPOINTS.AUTH}/logout`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Refresh access token
export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_ENDPOINTS.AUTH}/refresh`, { refreshToken });
  return response.data;
};

// Get current user profile
export const getCurrentUser = async (token: string): Promise<User> => {
  const response = await axios.get(`${API_ENDPOINTS.USER}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Update user profile
export const updateProfile = async (token: string, userData: Partial<User>): Promise<User> => {
  const response = await axios.put(`${API_ENDPOINTS.USER}/me`, userData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Create new user profile
export const createUserProfile = async (userData: RegisterRequest): Promise<User> => {
  const response = await axios.post(`${API_ENDPOINTS.USER}`, userData);
  return response.data;
};

// Validate token and get user ID
export const validateToken = async (token: string): Promise<number> => {
  const response = await axios.get(`${API_ENDPOINTS.AUTH}/validate`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.userId;
};

// Get user profile by ID
export const getUserProfile = async (token: string, userId: number): Promise<User> => {
  const response = await axios.get(`${API_ENDPOINTS.USER}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export default {
  requestOtp,
  verifyOtp,
  login,
  registerUser,
  logout,
  refreshToken,
  getCurrentUser,
  updateProfile,
  createUserProfile,
  validateToken,
  getUserProfile
};
