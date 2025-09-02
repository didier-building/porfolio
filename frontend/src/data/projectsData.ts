export interface ProjectData {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: 'web' | 'cloud' | 'blockchain';
  links: {
    github: string | null;
    live: string | null;
  };
}

export const fallbackProjects: ProjectData[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce platform built with Django REST API and React frontend. Features include user authentication, payment processing, and inventory management.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    technologies: ["Django", "React", "PostgreSQL", "Stripe", "Docker"],
    category: "web",
    links: {
      github: "https://github.com/didier-building/ecommerce-platform",
      live: "https://demo-ecommerce.example.com"
    }
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Modern task management application with real-time collaboration features. Built with Django channels for WebSocket support and React for dynamic UI.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80",
    technologies: ["Django", "React", "WebSocket", "Redis", "PostgreSQL"],
    category: "web",
    links: {
      github: "https://github.com/didier-building/task-manager",
      live: null
    }
  },
  {
    id: 3,
    title: "Cloud Infrastructure Dashboard",
    description: "Monitoring dashboard for cloud infrastructure with real-time metrics, alerts, and automated scaling recommendations.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    technologies: ["Python", "AWS", "Docker", "Kubernetes", "Grafana"],
    category: "cloud",
    links: {
      github: "https://github.com/didier-building/cloud-dashboard",
      live: null
    }
  }
];

export const fallbackSkills = [
  { id: 1, name: "Python", category: "Backend", proficiency: 90 },
  { id: 2, name: "Django", category: "Backend", proficiency: 85 },
  { id: 3, name: "JavaScript", category: "Frontend", proficiency: 80 },
  { id: 4, name: "React", category: "Frontend", proficiency: 75 },
  { id: 5, name: "TypeScript", category: "Frontend", proficiency: 70 },
  { id: 6, name: "PostgreSQL", category: "Database", proficiency: 80 },
  { id: 7, name: "Docker", category: "DevOps", proficiency: 75 },
  { id: 8, name: "AWS", category: "Cloud", proficiency: 70 },
  { id: 9, name: "Git", category: "Tools", proficiency: 85 },
  { id: 10, name: "Linux", category: "Tools", proficiency: 80 }
];