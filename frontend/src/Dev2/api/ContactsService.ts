import axios from 'axios';
import { getApiUrl, API_CONFIG } from '../config/apiConfig';

export const getContacts = async () => {
  const response = await axios.get(getApiUrl(API_CONFIG.CONTACTS.LIST));
  return response.data;
};

export const syncContacts = async (contacts: any[]) => {
  const response = await axios.post(getApiUrl(API_CONFIG.CONTACTS.SYNC), { contacts });
  return response.data;
};

export const searchUsers = async (query: string) => {
  const response = await axios.get(getApiUrl(API_CONFIG.CONTACTS.SEARCH), {
    params: { query },
  });
  return response.data;
}; 