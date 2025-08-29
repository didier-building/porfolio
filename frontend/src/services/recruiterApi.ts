/**
 * Recruiter API service for microsite
 * Fast JD → Fit → Contact flow
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const recruiterApi = axios.create({
  baseURL: `${API_BASE_URL}/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Response interceptor for error handling
recruiterApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      // Handle rate limiting with custom response
      return Promise.resolve({
        data: error.response.data,
        status: 429,
        isRateLimited: true
      });
    }
    return Promise.reject(error);
  }
);

export interface FitAnalysisResult {
  score: number;
  summary: string;
  matches: string[];
  gaps: string[];
  questions: string[];
  availability: string;
  generated_at: string;
  fallback?: boolean;
}

export interface ChatResponse {
  response: string;
  sources: Array<{
    title: string;
    type: string;
    relevance?: string;
  }>;
  portfolio_only: boolean;
  confidence?: number;
  error?: boolean;
}

export interface AnalyticsEvent {
  event: string;
  metadata?: Record<string, any>;
}

class RecruiterApiService {
  /**
   * Analyze job description fit
   * POST /api/v1/fit/analyze
   */
  async analyzeFit(jobDescription: string): Promise<{
    data: FitAnalysisResult;
    cached: boolean;
    isRateLimited?: boolean;
  }> {
    try {
      const response = await recruiterApi.post('/fit/analyze/', {
        job_description: jobDescription
      });

      if (response.isRateLimited) {
        throw new Error('Rate limit exceeded');
      }

      return {
        data: response.data,
        cached: response.headers['x-cache'] === 'HIT'
      };
    } catch (error: any) {
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later or book a call.');
      }
      throw new Error(error.response?.data?.error || 'Analysis failed');
    }
  }

  /**
   * Download tailored CV
   * POST /api/v1/fit/cv
   */
  async downloadCV(jobDescription?: string, email?: string, consent?: boolean): Promise<Blob> {
    try {
      const response = await recruiterApi.post('/fit/cv/', {
        job_description: jobDescription || '',
        email: email || '',
        consent: consent || false
      }, {
        responseType: 'blob'
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'CV generation failed');
    }
  }

  /**
   * Portfolio chat
   * POST /api/v1/chat
   */
  async chatWithPortfolio(message: string): Promise<ChatResponse> {
    try {
      const response = await recruiterApi.post('/chat/', {
        message
      });

      if (response.isRateLimited) {
        throw new Error('Rate limit exceeded');
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(error.response?.data?.error || 'Chat failed');
    }
  }

  /**
   * Track analytics event
   * POST /api/v1/analytics
   */
  async trackEvent(event: string, metadata?: Record<string, any>): Promise<void> {
    try {
      await recruiterApi.post('/analytics/', {
        event,
        metadata: metadata || {}
      });
    } catch (error) {
      // Analytics failures should not break the user experience
      console.warn('Analytics tracking failed:', error);
    }
  }

  /**
   * Get portfolio projects (from legacy API)
   */
  async getProjects(): Promise<any[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile/projects/`);
      return response.data.projects || [];
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      return [];
    }
  }

  /**
   * Get portfolio skills (from legacy API)
   */
  async getSkills(): Promise<any[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile/skills/`);
      return response.data.skills || [];
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      return [];
    }
  }

  /**
   * Get portfolio experience (from legacy API)
   */
  async getExperience(): Promise<any[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile/experience/`);
      return response.data.experience || [];
    } catch (error) {
      console.error('Failed to fetch experience:', error);
      return [];
    }
  }
}

export const recruiterApi = new RecruiterApiService();
export default recruiterApi;
