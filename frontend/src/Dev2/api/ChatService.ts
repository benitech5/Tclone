import axios from 'axios';
import { getApiUrl, API_CONFIG } from '../config/apiConfig';

export const getConversations = async () => {
  const response = await axios.get(getApiUrl(API_CONFIG.CHAT.CONVERSATIONS));
  return response.data;
};

export const getMessages = async (conversationId: string) => {
  const response = await axios.get(getApiUrl(API_CONFIG.CHAT.MESSAGES), {
    params: { conversationId },
  });
  return response.data;
};

export const sendMessage = async (conversationId: string, content: string) => {
  const response = await axios.post(getApiUrl(API_CONFIG.CHAT.MESSAGES), {
    conversationId,
    content,
  });
  return response.data;
}; 