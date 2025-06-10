import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  image: string;
  created_at: string;
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/blog/`);
        setPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">Thoughts, tutorials and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-slate-50 dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
              {post.image ? (
                <img 
                  src={post.image.startsWith('http') 
                    ? post.image 
                    : `${import.meta.env.VITE_API_URL?.replace('/api', '')}${post.image}`} 
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
                    day: 'numeric'
                  })}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{post.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">{post.summary}</p>
                
                <Link 
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-teal-600 dark:text-teal-500 hover:text-teal-700 dark