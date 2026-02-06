import axios from 'axios';
import { API_URLS } from '../config/api';

const API_URL = API_URLS.POSITIONS;

export const getAllPositions = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getPositionsByDivision = async (divisionId) => {
    const response = await axios.get(`${API_URL}/division/${divisionId}`);
    return response.data;
};

export const getPositionsByEmployeeId = async (employeeId) => {
    const response = await axios.get(`${API_URL}/employee/${employeeId}`);
    return response.data;
};

export const createPosition = async (position) => {
    const response = await axios.post(API_URL, position);
    return response.data;
};

export const updatePosition = async (id, position) => {
    const response = await axios.put(`${API_URL}/${id}`, position);
    return response.data;
};

export const deletePosition = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};

export const assignEmployeeToPosition = async (positionId, employeeId) => {
    const response = await axios.post(`${API_URL}/${positionId}/assign/${employeeId}`);
    return response.data;
};

export const releasePosition = async (positionId) => {
    const response = await axios.post(`${API_URL}/${positionId}/release`);
    return response.data;
};
