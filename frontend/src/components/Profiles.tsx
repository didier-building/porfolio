import { useEffect, useState } from 'react';
import { profilesApi } from '../services/api';

interface SocialProfile {
  id: number;
  platform: string;
  handle: string;
  url: string;
}

export default function Profiles() {
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);

  useEffect(() => {
    profilesApi
      .list()
      .then((res) => setProfiles(res.data))
      .catch((err) => console.error('Failed to load profiles', err));
  }, []);

  return (
    <section className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Social Profiles</h1>
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
    </section>
  );
}
