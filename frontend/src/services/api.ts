import axios from 'axios';

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
  jobMatchAnalyze: (data: { job_description: string }) =>
    api.post('/ai/jobmatch/analyze/', data),
  projectExplainerChat: (data: { question: string; project_ids?: number[] }) =>
    api.post('/ai/project-explainer/chat/', data),
};

export const commsApi = {
  list: () => api.get('/comms/'),
};

export const profilesApi = {
  list: () => api.get('/profiles/'),
};

export const blogApi = {
  list: (params?: Record<string, unknown>) => api.get('/blog/', { params }),
  getBySlug: (slug: string) => api.get(`/blog/${slug}/`),
};

export const projectsApi = {
  getAll: () => api.get('/projects/'),
};

export const contactApi = {
  submit: (data: unknown) => api.post('/contact/', data),
};

export default api;
