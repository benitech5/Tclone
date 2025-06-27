import axios from 'axios';
import { getApiUrl, API_CONFIG } from '../config/apiConfig';

const ContactsService = {
  getContacts: async () => {
    // Replace with real API call
    return [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
      { id: '3', name: 'Charlie' },
    ];
  },

  syncContacts: async (contacts: any[]) => {
    const response = await axios.post(getApiUrl(API_CONFIG.CONTACTS.SYNC), { contacts });
    return response.data;
  },

  searchUsers: async (query: string) => {
    const response = await axios.get(getApiUrl(API_CONFIG.CONTACTS.SEARCH), {
      params: { query },
    });
    return response.data;
  },
};

export default ContactsService; 