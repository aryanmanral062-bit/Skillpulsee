import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    // API key for manager dashboard
    'X-API-Key': 'your-secret-api-key-for-manager-dashboard'
  }
});
