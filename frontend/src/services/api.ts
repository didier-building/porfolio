import axios from 'axios';

// Log the API URL for debugging
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
console.log('API URL:', apiUrl);

// Create axios instance with base URL
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
});

// Add detailed logging for requests and responses
api.interceptors.request.use(
  config => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response;
  },
  error => {
    console.error(`API Error from ${error.config?.url}:`, error.response?.data || error.message);
    // Always return a rejected promise to ensure loading states are updated
    return Promise.reject(error);
  }
);

// API services for each endpoint
export const projectsApi = {
  getAll: () => api.get('/projects/'),
  getById: (id: number) => api.get(`/projects/${id}/`),
};

export const skillsApi = {
  getAll: () => api.get('/skills/'),
};

export const experiencesApi = {
  getAll: () => api.get('/experiences/'),
};

export const educationApi = {
  getAll: () => api.get('/educations/'),
};

export const blogApi = {
  getAll: () => api.get('/blog/'),
  getBySlug: (slug: string) => api.get(`/blog/${slug}/`),
};

export const contactApi = {
  submit: (data: any) => api.post('/contacts/', data),
};

export default api;
