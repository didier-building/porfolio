import React, { useState, useEffect, useCallback } from 'react';
import { projectsApi, MEDIA_BASE } from '../services/api';
import { fallbackProjects } from '../data/projectsData';

const isDev = import.meta.env.DEV;

interface Technology {
  id?: number;
  name: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  github_url?: string;
  live_url?: string;
  technologies: (Technology | string)[];
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const maxRetries = 3;

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await projectsApi.getAll();

      // Handle both paginated and non-paginated responses
      const projectsData = response.data.results || response.data;
      
      if (!Array.isArray(projectsData)) {
        throw new Error('Invalid projects data format');
      }

      setProjects(projectsData);
      setFilteredProjects(projectsData);

      // Extract unique technologies
      const techs = new Set<string>();
      projectsData.forEach((project: Project) => {
        project.technologies?.forEach(tech => {
          const techName = typeof tech === 'string' ? tech : tech.name;
          techs.add(techName);
        });
      });
      setTechnologies(['All', ...Array.from(techs)]);
    } catch (error: unknown) {
      console.warn('API failed, using fallback projects data');
      // Use fallback data when API fails
      const fallbackProjectsData = fallbackProjects.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        image_url: p.image,
        github_url: p.links.github,
        live_url: p.links.live,
        technologies: p.technologies
      }));
      
      setProjects(fallbackProjectsData);
      setFilteredProjects(fallbackProjectsData);
      
      // Extract technologies from fallback data
      const techs = new Set<string>();
      fallbackProjectsData.forEach((project) => {
        project.technologies?.forEach(tech => {
          const techName = typeof tech === 'string' ? tech : tech.name;
          techs.add(techName);
        });
      });
      setTechnologies(['All', ...Array.from(techs)]);
      setError(null); // Don't show error since we have fallback data
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      fetchProjects();
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    
    if (filter === 'All') {
      setFilteredProjects(projects);
      return;
    }
    
    const filtered = projects.filter(project => 
      project.technologies?.some(tech => {
        const techName = typeof tech === 'string' ? tech : tech.name;
        return techName === filter;
      })
    );
    setFilteredProjects(filtered);
  };

  if (isLoading) {
    return (
      <section id="projects" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            {retryCount < maxRetries ? (
              <button
                onClick={handleRetry}
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Retry (Attempt {retryCount + 1} of {maxRetries})
              </button>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                Retry limit reached. Please try again later.
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
            <span>Portfolio Showcase</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Featured Projects
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            A collection of applications and solutions I've built using modern technologies. 
            Each project demonstrates different aspects of full-stack development and problem-solving.
          </p>
        </div>

        {/* Filter Buttons */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => handleFilterClick('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'All'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              All
            </button>
            
            {technologies.map(tech => (
              <button
                key={tech}
                onClick={() => handleFilterClick(tech)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === tech
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        )}

        {filteredProjects.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-600 dark:text-slate-400">No projects found. Add some projects in the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 hover:rotate-1 transform-gpu perspective-1000 cursor-pointer min-h-[480px] flex flex-col"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                {/* 3D Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Project Image */}
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                      onError={(e) => {
                        if (isDev) {
                          console.error(`Failed to load image: ${project.image_url}`);
                        }
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
                      <div className="text-white text-center">
                        <svg className="w-16 h-16 mx-auto mb-2 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
                        </svg>
                        <p className="text-sm font-medium">{project.title}</p>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  {/* Floating Action Indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6 relative z-10 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300 line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed text-sm flex-grow line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.slice(0, 6).map((tech, index) => {
                        const techName = typeof tech === 'string' ? tech : tech.name;
                        return (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-medium rounded-full backdrop-blur-sm hover:from-teal-500/20 hover:to-blue-500/20 hover:scale-105 transition-all duration-200 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilter(techName);
                              const filtered = projects.filter(p =>
                                p.technologies.some(t => {
                                  const tName = typeof t === 'string' ? t : t.name;
                                  return tName === techName;
                                })
                              );
                              setFilteredProjects(filtered);
                            }}
                          >
                            {techName}
                          </span>
                        );
                      })}
                      {project.technologies.length > 6 && (
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-medium rounded-full">
                          +{project.technologies.length - 6} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Project Links */}
                  <div className="flex space-x-3 mt-auto">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md transform-gpu group/btn"
                      >
                        <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover/btn:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="text-sm font-medium">Code</span>
                      </a>
                    )}

                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg transform-gpu group/btn"
                      >
                        <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                        <span className="text-sm font-medium">Live Demo</span>
                      </a>
                    )}

                    {/* View Details Button (always present) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Could open a modal or navigate to project details
                        console.log('View project details:', project.title);
                      }}
                      className="flex items-center px-4 py-2 bg-transparent border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-all duration-300 hover:scale-105 transform-gpu group/btn"
                    >
                      <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      <span className="text-sm font-medium">Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
