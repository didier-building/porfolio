import axios, { type AxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const MEDIA_BASE = API_URL?.replace(/\/api\/?$/, '') || '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const aiApi = {
  jobMatchAnalyze: (
    data: { job_description: string },
    config?: AxiosRequestConfig,
  ) => api.post('/ai/jobmatch/analyze/', data, config),
  projectExplainerChat: (
    data: { question: string; project_ids?: number[] },
    config?: AxiosRequestConfig,
  ) => api.post('/ai/project-explainer/chat/', data, config),
};

export const commsApi = {
  list: (config?: AxiosRequestConfig) => api.get('/comms/', config),
};

export const profilesApi = {
  list: (config?: AxiosRequestConfig) => api.get('/profiles/', config),
};

export const blogApi = {
  list: (
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ) => api.get('/blog/', { params, ...config }),
  getBySlug: (slug: string, config?: AxiosRequestConfig) =>
    api.get(`/blog/${slug}/`, config),
};

export const projectsApi = {
  getAll: (config?: AxiosRequestConfig) => api.get('/projects/', config),
};

export const skillsApi = {
  getAll: () => api.get('/skills/'),
};

export const contactApi = {
  submit: (data: unknown) => api.post('/contact/', data),
};

export default api;
