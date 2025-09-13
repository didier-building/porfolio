import React from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

const Blog: React.FC = () => {
  // Mock blog posts data - in real app this would come from API
  const blogPosts = [
    {
      id: 1,
      title: "Building Scalable APIs with Django REST Framework",
      excerpt: "Best practices for designing production-ready REST APIs that can handle thousands of requests per second while maintaining clean, maintainable code.",
      content: "In this deep dive, we explore advanced Django REST Framework patterns including serializers, viewsets, pagination, and performance optimization techniques...",
      tags: ["Django", "REST API", "Python", "Backend"],
      readTime: "8 min read",
      publishedAt: "2025-01-10",
      category: "Backend Development"
    },
    {
      id: 2,
      title: "Containerizing Applications with Docker & Kubernetes",
      excerpt: "A comprehensive guide to containerizing web applications and deploying them to production using Docker containers and Kubernetes orchestration.",
      content: "Container technology has revolutionized how we deploy and scale applications. In this article, we'll walk through containerizing a Django application...",
      tags: ["Docker", "Kubernetes", "DevOps", "Deployment"],
      readTime: "12 min read",
      publishedAt: "2025-01-05", 
      category: "DevOps"
    },
    {
      id: 3,
      title: "Modern Frontend Development with React & TypeScript",
      excerpt: "Exploring the latest React patterns, hooks, and TypeScript integration for building robust, type-safe user interfaces that scale.",
      content: "React has evolved significantly with hooks and concurrent features. Combined with TypeScript, we can build incredibly robust applications...",
      tags: ["React", "TypeScript", "Frontend", "JavaScript"],
      readTime: "10 min read",
      publishedAt: "2024-12-28",
      category: "Frontend Development"
    },
    {
      id: 4,
      title: "Blockchain Development: Smart Contracts with Vyper",
      excerpt: "Introduction to writing secure smart contracts using Vyper, a Python-like language for Ethereum development with enhanced security features.",
      content: "Vyper offers a more secure alternative to Solidity for smart contract development. Let's explore its features and build a sample contract...",
      tags: ["Blockchain", "Vyper", "Smart Contracts", "Web3"],
      readTime: "15 min read",
      publishedAt: "2024-12-20",
      category: "Blockchain"
    },
    {
      id: 5,
      title: "AI Integration in Web Applications",
      excerpt: "Practical approaches to integrating AI capabilities into web applications, from simple API calls to complex machine learning pipelines.",
      content: "Artificial Intelligence is no longer limited to research labs. Modern web applications can leverage AI through various APIs and libraries...",
      tags: ["AI", "Machine Learning", "Python", "Integration"],
      readTime: "7 min read",
      publishedAt: "2024-12-15",
      category: "Artificial Intelligence"
    },
    {
      id: 6,
      title: "Database Optimization and Performance Tuning",
      excerpt: "Advanced techniques for optimizing PostgreSQL and MySQL databases, including indexing strategies, query optimization, and connection pooling.",
      content: "Database performance is crucial for application success. This article covers practical optimization techniques that can improve query performance...",
      tags: ["Database", "PostgreSQL", "MySQL", "Performance"],
      readTime: "11 min read",
      publishedAt: "2024-12-10",
      category: "Database"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section id="blog" className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium mb-6">
            <BookOpen size={16} />
            <span>Technical Journal</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Blog & <span className="text-gradient-teal">Insights</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Thoughts, tutorials, and insights on modern software development, emerging technologies, and engineering best practices.
          </p>
        </div>

        {/* Blog Posts Grid - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {blogPosts.map((post, index) => (
            <article 
              key={post.id}
              className={`group relative bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-slate-200/50 dark:border-slate-700/50 ${
                index === 0 ? 'lg:col-span-2' : ''
              }`}
            >
              {/* Featured Post Badge for First Post */}
              {index === 0 && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Featured
                </div>
              )}

              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-medium">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className={`${index === 0 ? 'lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center' : ''}`}>
                <div>
                  <h3 className={`font-bold text-slate-900 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300 ${
                    index === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'
                  }`}>
                    {post.title}
                  </h3>
                  
                  <p className={`text-slate-600 dark:text-slate-400 mb-4 leading-relaxed ${
                    index === 0 ? 'text-lg' : ''
                  }`}>
                    {post.excerpt}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs"
                      >
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Read More Button */}
                  <button className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors duration-300 group-hover:gap-3">
                    <span>Read More</span>
                    <ArrowRight size={16} className="transition-transform duration-300" />
                  </button>
                </div>

                {/* Featured Post Visual Element */}
                {index === 0 && (
                  <div className="hidden lg:block">
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <div className="text-white text-center">
                          <BookOpen size={48} className="mx-auto mb-4 opacity-80" />
                          <p className="text-lg font-medium">Latest Article</p>
                        </div>
                      </div>
                      <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent-100 dark:bg-purple-500/20 rounded-full animate-float shadow-lg dark:shadow-purple-500/20"></div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Want to Stay Updated?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              Follow my technical journey and get notified about new articles, tutorials, and insights on modern software development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://x.com/didier53053" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Follow on X
              </a>
              <a 
                href="https://github.com/didier-building" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;