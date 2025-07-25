import axios from "axios";

const API_URL = "http://localhost:8082/api/chat";

// Helper to get JWT token from storage (customize as needed)
const getAuthHeader = async () => {
  // Replace with your actual token retrieval logic
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const sendMessage = async (groupId: number, content: string) => {
  // Simulate sending a message
  return Promise.resolve({
    data: { id: Date.now(), sender: "You", content, groupId },
  });
};

export const getMessages = async (groupId: number) => {
  // Return dummy messages
  return Promise.resolve({
    data: [
      { id: 1, sender: "User1", content: "Welcome to the demo chat!", groupId },
      { id: 2, sender: "User2", content: "This is a sample message.", groupId },
    ],
  });
};

export const getUserGroups = async () => {
  // Return dummy group data
  return Promise.resolve({
    data: [
      { id: 1, name: "Demo Group 1" },
      { id: 2, name: "Demo Group 2" },
    ],
  });
};

export const createGroup = async (data: any) => {
  return axios.post(`${API_URL}/groups`, data, {
    headers: await getAuthHeader(),
  });
};

export const getSavedMessages = async () => {
  return axios.get(`${API_URL}/saved`, { headers: await getAuthHeader() });
};

export const saveMessage = async (messageId: number) => {
  return axios.post(
    `${API_URL}/saved/${messageId}`,
    {},
    { headers: await getAuthHeader() }
  );
};

export const unsaveMessage = async (messageId: number) => {
  return axios.delete(`${API_URL}/saved/${messageId}`, {
    headers: await getAuthHeader(),
  });
};

export const getPinnedMessages = async (groupId: number) => {
  return axios.get(`${API_URL}/pinned/${groupId}`, {
    headers: await getAuthHeader(),
  });
};

export const pinMessage = async (messageId: number) => {
  return axios.post(
    `${API_URL}/pinned/${messageId}`,
    {},
    { headers: await getAuthHeader() }
  );
};

export const unpinMessage = async (messageId: number) => {
  return axios.delete(`${API_URL}/pinned/${messageId}`, {
    headers: await getAuthHeader(),
  });
};

export const getMediaShared = async (groupId: number) => {
  return axios.get(`${API_URL}/media/${groupId}`, {
    headers: await getAuthHeader(),
  });
};

export const forwardMessage = async (data: any) => {
  return axios.post(`${API_URL}/forward`, data, {
    headers: await getAuthHeader(),
  });
};

export const getChatSettings = async (groupId: number) => {
  return axios.get(`${API_URL}/settings/${groupId}`, {
    headers: await getAuthHeader(),
  });
};

export const updateChatSettings = async (groupId: number, data: any) => {
  return axios.put(`${API_URL}/settings/${groupId}`, data, {
    headers: await getAuthHeader(),
  });
};
