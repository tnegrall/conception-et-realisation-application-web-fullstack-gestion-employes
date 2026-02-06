import { API_URLS } from '../config/api';
import { getAuthHeaders } from '../utils/authUtils';

export const getAllUsers = async () => {
  try {
    const response = await fetch(API_URLS.USERS, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Impossible de récupérer les utilisateurs');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
