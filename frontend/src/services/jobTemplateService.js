import axios from 'axios';
import { API_URLS } from '../config/api';

const API_URL = `${API_URLS.BASE}/api/job-templates`;

export const getAllJobTemplates = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getJobTemplateById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createJobTemplate = async (jobTemplate) => {
    const response = await axios.post(API_URL, jobTemplate);
    return response.data;
};

export const updateJobTemplate = async (id, jobTemplate) => {
    const response = await axios.put(`${API_URL}/${id}`, jobTemplate);
    return response.data;
};

export const deleteJobTemplate = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};

export const getJobTemplatesByDirection = async (id) => {
    const response = await axios.get(`${API_URL}/direction/${id}`);
    return response.data;
};

export const getJobTemplatesByService = async (id) => {
    const response = await axios.get(`${API_URL}/service/${id}`);
    return response.data;
};

export const getJobTemplatesByDivision = async (id) => {
    const response = await axios.get(`${API_URL}/division/${id}`);
    return response.data;
};
