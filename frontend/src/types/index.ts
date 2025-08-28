// Common types for the portfolio application

export interface Technology {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image?: string;
  start_date: string;
  end_date?: string;
  technologies: Technology[];
  github_url?: string;
  live_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  proficiency: number;
  category: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface SocialProfile {
  id: number;
  platform: string;
  handle: string;
  url: string;
}

export interface CommsDocument {
  id: number;
  title: string;
  doc_type: 'cv' | 'other';
  file: string;
  published: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  image?: string;
  created_at: string;
  updated_at: string;
  published: boolean;
}

export interface JobMatchResult {
  match_score: number;
  rationale: string;
  strengths: string[];
  gaps: string[];
  pitch: string;
  keywords: string[];
  top_projects: Project[];
  engine: string;
}

export interface ProjectExplainerResult {
  answer: string;
  used_projects: Project[];
  engine: string;
}

export interface ApiResponse<T> {
  results?: T[];
  count?: number;
  next?: string;
  previous?: string;
}

export interface ApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}
