// Configuration de l'URL de l'API
// Utilise la variable d'environnement ou localhost par défaut
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const API_URLS = {
  BASE: API_BASE_URL,
  AUTH: `${API_BASE_URL}/authenticate`,
  REGISTER: `${API_BASE_URL}/register`,
  VERIFY_USERNAME: (username) => `${API_BASE_URL}/verify-username/${username}`,
  RESET_PASSWORD: `${API_BASE_URL}/reset-password`,
  EMPLOYEES: `${API_BASE_URL}/api/employees`,
  CONTRACTS: `${API_BASE_URL}/api/contracts`,
  POSITIONS: `${API_BASE_URL}/api/positions`,
  DOCUMENTS: `${API_BASE_URL}/api/documents`,
  ORGANIZATION: `${API_BASE_URL}/api/organization`,
  USERS: `${API_BASE_URL}/api/users`,
};

export default API_BASE_URL;

