import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { blogApi } from '../services/api';

interface BlogPost {
  title: string;
  content: string;
  image?: string;
  created_at: string;
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    blogApi
      .getBySlug(slug)
      .then((res) => setPost(res.data))
      .catch((err) => console.error('Failed to load post', err))
      .finally(() => setLoading(false));
  }, [slug]);

  const resolveImage = (img?: string) =>
    img && !img.startsWith('http')
      ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}${img}`
      : img;

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!post) {
    return <div className="p-8">Post not found</div>;
  }

  return (
    <article className="p-8 max-w-3xl mx-auto prose prose-slate dark:prose-invert">
      {post.image && (
        <img src={resolveImage(post.image)} alt={post.title} className="mb-4" />
      )}
      <h1>{post.title}</h1>
      <p className="text-sm text-slate-500 mb-4">
        {new Date(post.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
