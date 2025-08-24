export interface ProjectTechnology {
  id: number;
  name: string;
}

export interface ProjectData {
  id: number;
  title: string;
  description: string;
  image: string;
  github_url: string | null;
  live_url: string | null;
  technologies: ProjectTechnology[];
}

// Default projects used when the backend API is unavailable.
// Replace this data with your own projects to customize the offline view.
export const fallbackProjects: ProjectData[] = [
  {
    id: 1,
    title: 'Sample Project',
    description: 'Displayed when the API is offline.',
    image: '',
    github_url: null,
    live_url: null,
    technologies: [
      { id: 1, name: 'TypeScript' },
      { id: 2, name: 'React' },
    ],
  },
];

