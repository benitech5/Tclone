import axios from 'axios';

// Replace 'YOUR_COMPUThER_IP' with your actual computer's IP address
// You can find this by running 'ipconfig' in Windows Command Prompt
const API_URL = 'http://localhost:8082/api/auth';

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
