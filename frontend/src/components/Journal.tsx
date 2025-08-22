import { useEffect, useState } from 'react';
import Meta from './Meta';
import useInView from '../hooks/useInView';
import { blogApi } from '../services/api';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  created_at: string;
}

export default function Journal() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const { ref, inView } = useInView<HTMLDivElement>();

  useEffect(() => {
    if (!inView || posts.length) return;
    const controller = new AbortController();
    blogApi
      .list(undefined, { signal: controller.signal })
      .then((res) => setPosts(res.data))
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.error('Failed to load journal', err);
        }
      });
    return () => controller.abort();
  }, [inView, posts.length]);

  return (
    <div
      ref={ref}
      aria-labelledby="journal-heading"
      className="p-8 max-w-4xl mx-auto"
    >
      <Meta title="Journal" description="Personal journal and blog posts" />
      <h2 id="journal-heading" className="text-2xl font-bold mb-4">
        Journal
      </h2>
      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.id}>
            <h3 className="text-xl font-semibold text-teal-600">
              {post.title}
            </h3>
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
    </div>
  );
}
