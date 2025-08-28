import { useState, useEffect } from 'react';
import { skillsApi } from '../services/api';
import type { Skill } from '../types';

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await skillsApi.getAll();
        setSkills(response.data.results || response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch skills');
        if (import.meta.env.DEV) {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return { skills, loading, error };
}