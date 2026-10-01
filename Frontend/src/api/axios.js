import axios from 'axios';

// Create Axios instance configured with backend URL and credentials for cookies
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
