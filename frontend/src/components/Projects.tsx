import { useProjects } from '../hooks/useProjects';

export default function Projects() {
  const { projects, loading, error } = useProjects();

  if (loading) return <div className="text-center py-10">Loading projects...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!projects || projects.length === 0) return <div className="text-center py-10">No projects found.</div>;

  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              {project.image ? (
                <img 
                  src={project.image.startsWith('http') 
                    ? project.image 
                    : `${import.meta.env.VITE_API_URL?.replace('/api', '')}${project.image}`} 
                  alt={project.title} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    console.error(`Failed to load image: ${project.image}`);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">No image</span>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech.id} 
                        className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-4">
                  {project.github_url && (
                    <a 
                      href={project.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                  {project.live_url && (
                    <a 
                      href={project.live_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
