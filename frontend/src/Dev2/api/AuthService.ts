import axios from 'axios';
import { getApiUrl, API_CONFIG } from '../config/apiConfig';

export const requestOtp = async (phoneNumber: string, name: string) => {
    return axios.post(getApiUrl(API_CONFIG.AUTH.REQUEST_OTP), { phoneNumber, name });
};

export const verifyOtp = async (phoneNumber: string, otp: string) => {
    const response = await axios.post(getApiUrl(API_CONFIG.AUTH.VERIFY_OTP), { phoneNumber, otp });
    return response.data; // This should contain the token
};

export const verifyEmailCode = async (email: string, code: string) => {
    const response = await axios.post(getApiUrl('/api/auth/verify-email-code'), { email, code });
    return response.data; // Should contain token or success info
};

export const setTwoStepVerification = async (password: string) => {
    const response = await axios.post(getApiUrl('/api/auth/two-step-verification'), { password });
    return response.data; // Should contain success info or token
};
