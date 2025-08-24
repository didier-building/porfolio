export interface BlogPostData {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  created_at: string;
}

// Default blog posts used when the backend API is unavailable.
// Replace these with your own posts to customize the offline view.
export const fallbackPosts: BlogPostData[] = [
  {
    id: 1,
    title: 'Welcome to the Blog',
    slug: 'welcome',
    summary: 'Sample post shown when the API is offline.',
    content: '<p>This is an example blog post used as fallback content.</p>',
    image: '',
    created_at: '2024-01-01',
  },
];

