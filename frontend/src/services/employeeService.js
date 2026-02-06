import axios from 'axios';
import { API_URLS } from '../config/api';

const API_URL = API_URLS.EMPLOYEES;
const resolveActor = () => localStorage.getItem('EMSusername') || 'RH';

export const getAllEmployees = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getEmployeeById = async id => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const addEmployee = async employee => {
  const response = await axios.post(API_URL, employee, {
    headers: {
      'X-Actor': resolveActor(),
    },
  });
  return response.data;
};

export const updateEmployee = async (id, employee) => {
  const response = await axios.put(`${API_URL}/${id}`, employee, {
    headers: {
      'X-Actor': resolveActor(),
    },
  });
  return response.data;
};

export const deleteEmployee = async id => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      'X-Actor': resolveActor(),
    },
  });
};

export const getEmployeesPage = async ({ page = 0, size = 20, sort = 'lastName,asc' } = {}) => {
  const response = await axios.get(`${API_URL}/filter`, {
    params: { page, size, sort },
  });
  return response.data;
};

export const getEmployeesLastUpdated = async () => {
  const response = await axios.get(`${API_URL}/last-updated`);
  return response.data;
};

export const uploadProfilePhoto = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${API_URL}/${id}/photo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getProfilePhoto = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/photo`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const getEmployeeActions = async id => {
  const response = await axios.get(`${API_URL}/${id}/actions`);
  return response.data;
};

export const changeEmployeeDivision = async (employeeId, divisionId) => {
  await axios.put(`${API_URL}/${employeeId}/change-division/${divisionId}`, {}, {
    headers: {
      'X-Actor': resolveActor(),
    },
  });
};

export const downloadEmployeePdf = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/pdf`, {
    responseType: 'blob',
    headers: {
      'Accept': 'application/pdf'
    }
  });
  return response.data;
};
