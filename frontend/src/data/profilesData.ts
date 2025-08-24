export interface SocialProfile {
  id: number;
  platform: string;
  handle: string;
  url: string;
}

// Default profiles used when the backend API is unavailable.
// Update these values to match your own social profiles.
export const fallbackProfiles: SocialProfile[] = [
  {
    id: 1,
    platform: 'GitHub',
    handle: 'sample',
    url: 'https://github.com/sample',
  },
];

