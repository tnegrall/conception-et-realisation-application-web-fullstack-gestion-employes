import axios from 'axios';
import { API_URLS } from '../config/api';

const API_URL = `${API_URLS.BASE}/api/stats/dashboard`;

export const getDashboardStats = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
