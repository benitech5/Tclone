import axios from 'axios';

// Replace 'YOUR_COMPUTER_IP' with your actual computer's IP address
// You can find this by running 'ipconfig' in Windows Command Prompt
const API_URL = 'http://192.168.97.32:8080/api/auth';

export const requestOtp = async (phoneNumber: string, name: string) => {
    return axios.post(`${API_URL}/request-otp`, { phoneNumber, name });
};

export const verifyOtp = async (phoneNumber: string, otp: string) => {
    const response = await axios.post(`${API_URL}/verify-otp`, { phoneNumber, otp });
    return response.data; // This should contain the token
};
