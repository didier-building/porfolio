import { useEffect, useState } from 'react';
import { blogApi } from '../services/api';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  created_at: string;
}

export default function Journal() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    blogApi
      .list('journal')
      .then((res) => setPosts(res.data))
      .catch((err) => console.error('Failed to load journal', err));
  }, []);

  return (
    <section className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Journal</h1>
      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.id}>
            <h2 className="text-xl font-semibold text-teal-600">
              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="text-sm text-slate-500 mb-2">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-slate-600">{post.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
