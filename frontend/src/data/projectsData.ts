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
    title: "E-Commerce API",
    description: "Django/DRF API for e-commerce platform with comprehensive product management, cart functionality, order processing, and payment integration. Built with PostgreSQL for data persistence and includes RESTful endpoints for seamless frontend integration.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
    technologies: ["Django", "DRF", "PostgreSQL", "REST API", "Docker"],
    category: "web",
    links: {
      github: "https://github.com/Solvit-Africa-Training-Center/e-commerce-team-Avatar",
      live: null
    }
  },
  {
    id: 2,
    title: "AI-Enhanced Portfolio Platform",
    description: "React/TypeScript frontend with Django/DRF backend featuring 6 AI-powered tools: job matching, chat bot, career insights, CV generation. Production deployment with Docker, health monitoring, and analytics.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    technologies: ["React", "TypeScript", "Django", "DRF", "AI/ML", "Docker"],
    category: "web",
    links: {
      github: "https://github.com/didier-building/porfolio",
      live: "https://imanirahari.netlify.app"
    }
  },
  {
    id: 3,
    title: "Supply Chain Management System",
    description: "Capstone project designed with Django REST + Vyper smart contracts for produce tracking with ownership transfers and status updates. Features comprehensive unit tests for contract interactions and documented API/contract boundaries.",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=800&q=80",
    technologies: ["Django", "REST", "Vyper", "Blockchain", "Smart Contracts", "Testing"],
    category: "blockchain",
    links: {
      github: "https://github.com/didier-building/Final_Year_Project",
      live: null
    }
  },
  {
    id: 4,
    title: "Career Compass API",
    description: "Student application workflows platform with Django/DRF and JWT. Features registration, profiles, program catalogs, preference ranking, tracking, and rule-based eligibility/matching module with PostgreSQL/MySQL.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    technologies: ["Django", "DRF", "JWT", "PostgreSQL", "MySQL", "Docker"],
    category: "web",
    links: {
      github: "https://github.com/Solvit-Africa-Training-Center/career-campass",
      live: null
    }
  }
];

export const fallbackSkills = [
  // Backend Development
  { id: 1, name: "Python", category: "Backend Development", proficiency: 65 },
  { id: 2, name: "Django", category: "Backend Development", proficiency: 60 },
  { id: 3, name: "Django REST Framework", category: "Backend Development", proficiency: 60 },
  { id: 4, name: "SQL", category: "Backend Development", proficiency: 55 },
  { id: 5, name: "REST APIs", category: "Backend Development", proficiency: 55 },
  { id: 6, name: "Bash", category: "Backend Development", proficiency: 50 },
  
  // Testing & Quality
  { id: 7, name: "PyTest", category: "Testing & Quality", proficiency: 60 },
  { id: 8, name: "Unittest", category: "Testing & Quality", proficiency: 60 },
  { id: 9, name: "Debugging", category: "Testing & Quality", proficiency: 60 },
  { id: 10, name: "TDD", category: "Testing & Quality", proficiency: 55 },
  { id: 11, name: "Code Review", category: "Testing & Quality", proficiency: 55 },
  
  // Blockchain & Web3
  { id: 12, name: "Solidity", category: "Blockchain & Web3", proficiency: 50 },
  { id: 13, name: "Vyper", category: "Blockchain & Web3", proficiency: 45 },
  { id: 14, name: "Smart Contracts", category: "Blockchain & Web3", proficiency: 50 },
  { id: 15, name: "Web3.py", category: "Blockchain & Web3", proficiency: 45 },
  { id: 16, name: "Blockchain Fundamentals", category: "Blockchain & Web3", proficiency: 55 },
  
  // Database & Storage
  { id: 17, name: "PostgreSQL", category: "Database & Storage", proficiency: 55 },
  { id: 18, name: "MySQL", category: "Database & Storage", proficiency: 50 },
  
  // DevOps & Cloud
  { id: 19, name: "Docker", category: "DevOps & Cloud", proficiency: 55 },
  { id: 20, name: "Kubernetes", category: "DevOps & Cloud", proficiency: 45 },
  { id: 21, name: "CI/CD Pipelines", category: "DevOps & Cloud", proficiency: 50 },
  { id: 22, name: "Git/GitHub", category: "DevOps & Cloud", proficiency: 60 },
  
  // Documentation
  { id: 23, name: "Technical Writing", category: "Documentation", proficiency: 60 },
  { id: 24, name: "API Documentation", category: "Documentation", proficiency: 55 }
];