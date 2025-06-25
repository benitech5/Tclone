import axios from 'axios';
import { getApiUrl } from '../config/apiConfig';

export const getProfile = async () => {
  const response = await axios.get(getApiUrl('/api/users/me'));
  return response.data;
};

export const updateProfile = async (profile: any) => {
  const response = await axios.put(getApiUrl('/api/users/me'), profile);
  return response.data;
};

export const uploadAvatar = async (file: any) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await axios.post(getApiUrl('/api/users/avatar'), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data; // Should contain the new avatar URL
}; 