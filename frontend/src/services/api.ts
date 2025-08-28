import axios, { type AxiosRequestConfig } from 'axios';
import type {
  Project,
  Skill,
  Experience,
  Education,
  Contact,
  SocialProfile,
  CommsDocument,
  BlogPost,
  JobMatchResult,
  ProjectExplainerResult,
  ApiResponse
} from '../types';

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const aiApi = {
  jobMatchAnalyze: (
    data: { job_description: string },
    config?: AxiosRequestConfig,
  ) => api.post<JobMatchResult>('/ai/jobmatch/analyze/', data, config),
  projectExplainerChat: (
    data: { question: string; project_ids?: number[] },
    config?: AxiosRequestConfig,
  ) => api.post<ProjectExplainerResult>('/ai/project-explainer/chat/', data, config),
};

export const commsApi = {
  list: (config?: AxiosRequestConfig) => api.get<ApiResponse<CommsDocument>>('/comms/', config),
};

export const profilesApi = {
  list: (config?: AxiosRequestConfig) => api.get<ApiResponse<SocialProfile>>('/profiles/', config),
};

export const blogApi = {
  list: (
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ) => api.get<ApiResponse<BlogPost>>('/blog/', { params, ...config }),
  getBySlug: (slug: string, config?: AxiosRequestConfig) =>
    api.get<BlogPost>(`/blog/${slug}/`, config),
};

export const projectsApi = {
  getAll: (config?: AxiosRequestConfig) => api.get<ApiResponse<Project>>('/profile/projects/', config),
  getById: (id: number, config?: AxiosRequestConfig) => api.get<Project>(`/projects/${id}/`, config),
};

export const skillsApi = {
  getAll: (config?: AxiosRequestConfig) => api.get<ApiResponse<Skill>>('/profile/skills/', config),
};

export const experienceApi = {
  getAll: (config?: AxiosRequestConfig) => api.get<ApiResponse<Experience>>('/profile/experience/', config),
};

export const educationApi = {
  getAll: (config?: AxiosRequestConfig) => api.get<ApiResponse<Education>>('/profile/education/', config),
};

export const contactApi = {
  submit: (data: Omit<Contact, 'id' | 'created_at'>) => api.post<Contact>('/contact/', data),
};

export default api;
