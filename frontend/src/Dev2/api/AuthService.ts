import apiConfig from '../config/apiConfig';

const AuthService = {
  requestOtp: async (phone: string) => {
    const response = await fetch(`${apiConfig.baseUrl}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    if (!response.ok) {
      let errorMsg = 'Failed to request OTP';
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) errorMsg = errorData.message;
      } catch (e) {}
      throw new Error(errorMsg);
    }
    return response.json();
  },
  verifyOtp: async (phone: string, otp: string) => {
    const response = await fetch(`${apiConfig.baseUrl}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });
    if (!response.ok) throw new Error('Failed to verify OTP');
    return response.json();
  },
};

export default AuthService;
