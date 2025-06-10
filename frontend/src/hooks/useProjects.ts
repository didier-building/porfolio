import { useState, useEffect } from 'react';
import { projectsApi } from '../services/api';

interface Technology {
  id: number;
  name: string;
  icon: string | null;
}

interface Project {
  id: number;
  title: string;
  description: string;
  image: string | null;
  start_date: string;
  end_date: string | null;
  technologies: Technology[];
  github_url: string | null;
  live_url: string | null;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        console.log("Fetching projects...");
        const response = await projectsApi.getAll();
        console.log("API response:", response);
        
        // Handle both paginated and non-paginated responses
        const projectsData = response.data.results || response.data;
        console.log("Projects data:", projectsData);
        
        setProjects(projectsData);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching projects:", err);
        setError(`Failed to fetch projects: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
}

export function useProject(id: number) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await projectsApi.getById(id);
        setProject(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch project');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return { project, loading, error };
}
