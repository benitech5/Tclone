import axios from 'axios';
import { getApiUrl } from '../config/apiConfig';

const UserService = {
  getProfile: async () => {
    // Replace with real API call
    return {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };
  },

  updateProfile: async (profile: any) => {
    const response = await axios.put(getApiUrl('/api/users/me'), profile);
    return response.data;
  },

  uploadAvatar: async (file: any) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axios.post(getApiUrl('/api/users/avatar'), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; // Should contain the new avatar URL
  },
};

export default UserService; 