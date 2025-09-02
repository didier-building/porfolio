import { useState, useEffect } from 'react';
import { skillsApi } from '../services/api';
import { fallbackSkills } from '../data/projectsData';
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
        const skillsData = response.data.results || response.data;
        setSkills(Array.isArray(skillsData) ? skillsData : []);
        setError(null);
      } catch (err) {
        // Use fallback data when API fails
        console.warn('API failed, using fallback skills data');
        setSkills(fallbackSkills);
        setError(null); // Don't show error since we have fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return { skills, loading, error };
}