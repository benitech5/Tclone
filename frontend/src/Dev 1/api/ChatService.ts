import axios from 'axios';
import { API_ENDPOINTS } from './config';

export const getMessages = async (chatId: string) => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_ENDPOINTS.MESSAGES}/chat/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const sendMessage = async (chatId: string, message: any) => {
  const token = localStorage.getItem('token');
  return axios.post(`${API_ENDPOINTS.MESSAGES}/chat/${chatId}`, message, {
    headers: { Authorization: `Bearer ${token}` }
  });
}; 