import { useState, useEffect } from 'react';
import { skillsApi } from '../services/api';

interface Skill {
  id: number;
  name: string;
  proficiency: number;
  category: string;
}

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return { skills, loading, error };
}