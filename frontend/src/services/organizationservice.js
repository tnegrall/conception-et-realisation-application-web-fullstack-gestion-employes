import axios from 'axios';
import { API_URLS } from '../config/api';

const API_URL = API_URLS.ORGANIZATION;
const resolveActor = () => localStorage.getItem('EMSusername') || 'RH';

// Get the full organization structure
export const getOrganizationStructure = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// --- Directions ---
export const addDirection = async (direction) => {
  const response = await axios.post(`${API_URL}/directions`, direction);
  return response.data;
};

export const updateDirection = async (id, direction) => {
  const response = await axios.put(`${API_URL}/directions/${id}`, direction);
  return response.data;
};

export const deleteDirection = async (id) => {
  await axios.delete(`${API_URL}/directions/${id}`);
};

// --- Services ---
export const addService = async (directionId, service) => {
  const response = await axios.post(`${API_URL}/services?directionId=${directionId}`, service);
  return response.data;
};

export const updateService = async (id, service) => {
  const response = await axios.put(`${API_URL}/services/${id}`, service);
  return response.data;
};

export const deleteService = async (id) => {
  await axios.delete(`${API_URL}/services/${id}`);
};

// --- Divisions ---
export const addDivision = async (serviceId, division) => {
  const response = await axios.post(`${API_URL}/divisions?serviceId=${serviceId}`, division);
  return response.data;
};

export const updateDivision = async (id, division) => {
  const response = await axios.put(`${API_URL}/divisions/${id}`, division);
  return response.data;
};

export const deleteDivision = async (id) => {
  await axios.delete(`${API_URL}/divisions/${id}`);
};

// --- Employee Counts ---
export const getDirectionEmployeeCount = async (id) => {
  const response = await axios.get(`${API_URL}/directions/${id}/employee-count`);
  return response.data;
};

export const getServiceEmployeeCount = async (id) => {
  const response = await axios.get(`${API_URL}/services/${id}/employee-count`);
  return response.data;
};

export const getDivisionEmployeeCount = async (id) => {
  const response = await axios.get(`${API_URL}/divisions/${id}/employee-count`);
  return response.data;
};

// --- Division Employees ---
export const getDivisionEmployees = async (id) => {
  const response = await axios.get(`${API_URL}/divisions/${id}/employees`);
  return response.data;
};

export const assignEmployeeToDivision = async (divisionId, employeeId) => {
  await axios.post(`${API_URL}/divisions/${divisionId}/assign/${employeeId}`, {}, {
    headers: {
      'X-Actor': resolveActor(),
    },
  });
};

export const removeEmployeeFromDivision = async (divisionId, employeeId) => {
  await axios.delete(`${API_URL}/divisions/${divisionId}/remove/${employeeId}`, {
    headers: {
      'X-Actor': resolveActor(),
    },
  });
};
