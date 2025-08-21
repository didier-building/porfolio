import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});


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
  list: (kind?: string) =>
    api.get('/blog/', kind ? { params: { kind } } : undefined),
  getBySlug: (slug: string) => api.get(`/blog/${slug}/`),
};

export const contactApi = {
  submit: (data: unknown) => api.post('/contacts/', data),
};

export default api;
