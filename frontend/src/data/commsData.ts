export interface CommsDocument {
  id: number;
  title: string;
  file: string;
}

// Default documents used when the backend API is unavailable.
// The file paths should point to assets available in the public folder.
export const fallbackComms: CommsDocument[] = [
  {
    id: 1,
    title: 'Sample Resume',
    file: '#',
  },
];

