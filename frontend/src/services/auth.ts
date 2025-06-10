import api from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await api.post<AuthTokens>('/token/', credentials);
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  refreshToken: async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
      const response = await api.post<{ access: string }>('/token/refresh/', {
        refresh: refreshToken,
      });
      localStorage.setItem('token', response.data.access);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return false;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

export default authService;