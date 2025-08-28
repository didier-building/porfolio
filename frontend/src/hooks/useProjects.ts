import { useState, useEffect } from 'react';
import { projectsApi } from '../services/api';
import type { Project } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectsApi.getAll();

        // Handle both paginated and non-paginated responses
        const projectsData = response.data.results || response.data;

        setProjects(projectsData);
        setError(null);
      } catch (err: any) {
        if (import.meta.env.DEV) {
          console.error("Error fetching projects:", err);
        }
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
        if (import.meta.env.DEV) {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return { project, loading, error };
}
