import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Github, Code2 } from 'lucide-react';
import { projectsApi } from '../services/api';
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
  category?: string; // Add category for filtering
}

const ProjectCarousel: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const maxRetries = 3;

  // Filter categories
  const filterCategories = ['All', 'Web', 'Blockchain', 'AI', 'IoT'];

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await projectsApi.getAll();
      const projectsData = response.data.results || response.data;
      
      if (!Array.isArray(projectsData)) {
        throw new Error('Invalid projects data format');
      }

      // Add categories to projects based on title/description analysis
      const categorizedProjects = projectsData.map((project: Project) => ({
        ...project,
        category: inferProjectCategory(project)
      }));

      setProjects(categorizedProjects);
      setFilteredProjects(categorizedProjects);
      setError(null);
    } catch (err) {
      if (retryCount < maxRetries) {
        console.warn(`API failed, retrying... (${retryCount + 1}/${maxRetries})`);
        setRetryCount(prev => prev + 1);
        setTimeout(fetchProjects, 1000);
        return;
      }
      
      console.warn('API failed, using fallback projects data');
      const categorizedFallback = fallbackProjects.map(project => ({
        ...project,
        category: inferProjectCategory(project)
      }));
      setProjects(categorizedFallback);
      setFilteredProjects(categorizedFallback);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Infer project category based on title, description, and technologies
  const inferProjectCategory = (project: Project): string => {
    const text = `${project.title} ${project.description}`.toLowerCase();
    const techs = project.technologies.map(t => typeof t === 'string' ? t : t.name).join(' ').toLowerCase();
    
    if (text.includes('blockchain') || text.includes('web3') || text.includes('smart contract') || techs.includes('ethereum') || techs.includes('solidity')) {
      return 'Blockchain';
    }
    if (text.includes('ai') || text.includes('machine learning') || text.includes('neural') || techs.includes('tensorflow') || techs.includes('pytorch')) {
      return 'AI';
    }
    if (text.includes('iot') || text.includes('sensor') || text.includes('arduino') || text.includes('raspberry')) {
      return 'IoT';
    }
    return 'Web';
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects when activeFilter changes
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === activeFilter));
    }
    setCurrentIndex(0); // Reset to first project when filter changes
  }, [activeFilter, projects]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  const goToProject = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-advance carousel every 8 seconds
  useEffect(() => {
    if (filteredProjects.length <= 1) return;
    
    const interval = setInterval(nextProject, 8000);
    return () => clearInterval(interval);
  }, [filteredProjects.length]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">{error}</div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-600 dark:text-slate-400">
          {activeFilter === 'All' ? 'No projects found.' : `No ${activeFilter} projects found.`}
        </p>
      </div>
    );
  }

  const currentProject = filteredProjects[currentIndex];

  return (
    <section id="projects" className="py-20 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 text-teal-600 dark:text-teal-400 rounded-full text-sm font-medium mb-6">
            <Code2 size={16} />
            <span>Portfolio Showcase</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Featured <span className="text-gradient-teal">Projects</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Explore my latest work showcasing full-stack development, AI integration, and production-ready solutions.
          </p>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {filterCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 transform ${
                  activeFilter === category
                    ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {category}
                {category !== 'All' && (
                  <span className="ml-2 text-xs opacity-75">
                    ({projects.filter(p => category === 'All' || p.category === category).length})
                  </span>
                )}
                {category === 'All' && (
                  <span className="ml-2 text-xs opacity-75">
                    ({projects.length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Project Display */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {filteredProjects.map((project, index) => (
                <div key={project.id} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[500px] bg-white dark:bg-slate-900 p-8 lg:p-12">
                    {/* Project Image */}
                    <div className="relative group">
                      <div className="relative overflow-hidden rounded-2xl shadow-lg">
                        {project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              if (isDev) {
                                console.error(`Failed to load image: ${project.image_url}`);
                              }
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-80 bg-gradient-to-br from-teal-500 to-blue-600 dark:from-teal-600 dark:to-blue-700 flex items-center justify-center">
                            <div className="text-white text-center">
                              <Code2 size={64} className="mx-auto mb-4 opacity-80" />
                              <p className="text-lg font-medium">{project.title}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Overlay with action buttons */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
                          <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg transition-all duration-300 hover:scale-105"
                              >
                                <Github size={16} className="mr-2" />
                                <span className="text-sm font-medium">Code</span>
                              </a>
                            )}
                            {project.live_url && (
                              <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-4 py-2 bg-teal-500/80 backdrop-blur-sm hover:bg-teal-500 text-white rounded-lg transition-all duration-300 hover:scale-105"
                              >
                                <ExternalLink size={16} className="mr-2" />
                                <span className="text-sm font-medium">Live Demo</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                          {project.title}
                        </h3>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Technologies */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                            Tech Stack
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => {
                              const techName = typeof tech === 'string' ? tech : (tech as any).name || tech;
                              return (
                                <span
                                  key={techIndex}
                                  className="px-3 py-1 bg-gradient-to-r from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 border border-teal-200 dark:border-teal-700/50 text-teal-700 dark:text-teal-300 text-sm font-medium rounded-full hover:scale-105 transition-transform duration-200"
                                >
                                  {techName}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg transform-gpu"
                          >
                            <Github size={18} className="mr-2" />
                            <span className="font-medium">View Code</span>
                          </a>
                        )}
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg transform-gpu"
                          >
                            <ExternalLink size={18} className="mr-2" />
                            <span className="font-medium">Live Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {filteredProjects.length > 1 && (
            <>
              <button
                onClick={prevProject}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextProject}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Project Indicators */}
        {filteredProjects.length > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {filteredProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToProject(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-teal-500 scale-125'
                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        )}

        {/* Project Counter */}
        {filteredProjects.length > 1 && (
          <div className="text-center mt-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Project {currentIndex + 1} of {filteredProjects.length}
              {activeFilter !== 'All' && (
                <span className="ml-2 text-xs">({activeFilter} projects)</span>
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectCarousel;