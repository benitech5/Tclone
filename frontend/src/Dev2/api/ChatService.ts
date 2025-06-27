import axios from 'axios';
import { getApiUrl, API_CONFIG } from '../config/apiConfig';

const ChatService = {
  getChats: async () => {
    const response = await axios.get(getApiUrl(API_CONFIG.CHAT.CONVERSATIONS));
    return response.data; // Should be an array of chats
  },
  getMessages: async (chatId) => {
    const response = await axios.get(getApiUrl(API_CONFIG.CHAT.MESSAGES), {
      params: { chatId },
    });
    return response.data; // Should be an array of messages
  },
  sendMessage: async (chatId, message) => {
    const response = await axios.post(getApiUrl(API_CONFIG.CHAT.MESSAGES), {
      chatId,
      message,
    });
    return response.data; // Should be the sent message object
  },
};

export default ChatService; 