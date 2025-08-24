import { useEffect, useState } from 'react';
import Meta from './Meta';
import useInView from '../hooks/useInView';
import { profilesApi } from '../services/api';
import { fallbackProfiles } from '../data/profilesData';

interface SocialProfile {
  id: number;
  platform: string;
  handle: string;
  url: string;
}

export default function Profiles() {
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);
  const { ref, inView } = useInView<HTMLDivElement>();

  useEffect(() => {
    if (!inView || profiles.length) return;
    const controller = new AbortController();
    profilesApi
      .list({ signal: controller.signal })
      .then((res) => setProfiles(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.error('Failed to load profiles', err);
          // Use fallback data when API call fails
          setProfiles(fallbackProfiles);
        }
      });
    return () => controller.abort();
  }, [inView, profiles.length]);

  return (
    <div
      ref={ref}
      aria-labelledby="profiles-heading"
      className="p-8 max-w-3xl mx-auto"
    >
      <Meta title="Profiles" description="Social media profiles" />
      <h2 id="profiles-heading" className="text-2xl font-bold mb-4">
        Social Profiles
      </h2>
      <ul className="space-y-2">
        {profiles.map((profile) => (
          <li key={profile.id}>
            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 underline"
            >
              {profile.platform}: {profile.handle}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
