import React, { useState } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { ProjectData } from '../data/projectsData';

interface ProjectCardProps {
  project: ProjectData;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full flex justify-between items-center">
            <div className="flex space-x-2">
              {project.links.github && (
                <a 
                  href={project.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  aria-label="View GitHub Repository"
                >
                  <Github size={20} className="text-white" />
                </a>
              )}
              {project.links.live && (
                <a 
                  href={project.links.live} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  aria-label="View Live Demo"
                >
                  <ExternalLink size={20} className="text-white" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{project.title}</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const [projects] = useState<ProjectData[]>([
    {
      id: 1,
      title: "Cloud-Native Microservices Platform",
      description: "A scalable microservices architecture deployed on Kubernetes with service mesh, monitoring, and CI/CD pipelines.",
      image: "https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      technologies: ["Kubernetes", "Docker", "Istio", "Go", "Prometheus", "GitHub Actions"],
      category: "cloud",
      links: {
        github: "https://github.com",
        live: "https://example.com"
      }
    },
    {
      id: 2,
      title: "E-commerce Web Application",
      description: "A full-stack e-commerce platform with product catalog, shopping cart, payment processing, and user authentication.",
      image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe", "AWS"],
      category: "web",
      links: {
        github: "https://github.com",
        live: "https://example.com"
      }
    },
    {
      id: 3,
      title: "Blockchain Voting System",
      description: "A decentralized voting application built on Ethereum, ensuring transparent and tamper-proof election results.",
      image: "https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      technologies: ["Solidity", "Web3.js", "React", "Truffle", "Ganache", "MetaMask"],
      category: "blockchain",
      links: {
        github: "https://github.com",
        live: null
      }
    },
    {
      id: 4,
      title: "IoT Dashboard",
      description: "A real-time dashboard for monitoring and controlling IoT devices with data visualization and alerts.",
      image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      technologies: ["React", "Node.js", "MQTT", "Socket.io", "Chart.js", "Arduino"],
      category: "web",
      links: {
        github: "https://github.com",
        live: "https://example.com"
      }
    },
    {
      id: 5,
      title: "Serverless API Gateway",
      description: "A scalable API gateway using serverless architecture for efficient request routing and processing.",
      image: "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      technologies: ["AWS Lambda", "API Gateway", "DynamoDB", "Terraform", "Node.js"],
      category: "cloud",
      links: {
        github: "https://github.com",
        live: null
      }
    },
    {
      id: 6,
      title: "NFT Marketplace",
      description: "A platform for creating, buying, and selling NFTs with wallet integration and transaction history.",
      image: "https://images.pexels.com/photos/8919570/pexels-photo-8919570.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      technologies: ["React", "Solidity", "IPFS", "Ethereum", "MetaMask", "Web3.js"],
      category: "blockchain",
      links: {
        github: "https://github.com",
        live: "https://example.com"
      }
    },
  ]);

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "web", name: "Web Development" },
    { id: "cloud", name: "Cloud & DevOps" },
    { id: "blockchain", name: "Blockchain" },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects = activeCategory === "all"
    ? projects
    : projects.filter(project => project.category === activeCategory);

  return (
    <section id="projects" className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">My Projects</h2>
          <div className="w-20 h-1 bg-teal-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and expertise.
          </p>
        </div>
        
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;