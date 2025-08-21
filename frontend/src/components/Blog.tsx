import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogApi, MEDIA_BASE } from '../services/api';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  image: string;
  created_at: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    blogApi
      .list()
      .then((res) => setPosts(res.data))
      .catch((err) => console.error('Error fetching blog posts:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const resolveImage = (img: string) =>
    img.startsWith('http')
      ? img
      : `${MEDIA_BASE}${img}`;

  if (isLoading) {
    return (
      <section id="blog" className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>Loading blog posts...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Blog</h2>
          <div className="w-20 h-1 bg-teal-600 mx-auto"></div>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
            Thoughts, tutorials and insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-50 dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg"
            >
              {post.image ? (
                <img
                  src={resolveImage(post.image)}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">Blog</span>
                </div>
              )}

              <div className="p-6">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {post.summary}
                </p>

                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-teal-600 dark:text-teal-500 hover:text-teal-700 dark:hover:text-teal-400"
                >
                  Read more
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
