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
    title: "Order & Inventory Backend",
    description: "Django/DRF API with PostgreSQL modeling orders, stock, reservations, and status transitions. Features idempotent endpoints, Celery workers for pick/pack/dispatch, caching and batched queries, OpenAPI & Postman collection, Dockerized env with seed data.",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80",
    technologies: ["Django", "DRF", "PostgreSQL", "Celery", "Docker", "OpenAPI", "Redis"],
    category: "web",
    links: {
      github: "https://github.com/didier-building/order-inventory-api",
      live: null
    }
  },
  {
    id: 2,
    title: "Ops & Customer Support Dashboard",
    description: "React/TypeScript dashboard with Tailwind for order tracking, exception workflows, and customer messaging. Features server-side filtering/sorting/pagination, JWT auth, role-based access, audit logs, and error boundaries.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    technologies: ["React", "TypeScript", "Tailwind", "JWT", "REST API"],
    category: "web",
    links: {
      github: "https://github.com/didier-building/ops-dashboard",
      live: null
    }
  },
  {
    id: 3,
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
    id: 4,
    title: "Blockchain Agricultural Supply Chain",
    description: "Capstone project designed with Django REST + Vyper smart contracts for produce tracking with ownership transfers and status updates. Features comprehensive unit tests for contract interactions and documented API/contract boundaries.",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=800&q=80",
    technologies: ["Django", "REST", "Vyper", "Blockchain", "Smart Contracts", "Testing"],
    category: "blockchain",
    links: {
      github: "https://github.com/didier-building/agri-supply-chain",
      live: null
    }
  },
  {
    id: 5,
    title: "DevEx Templates & Workflows",
    description: "Reusable GitHub Actions pipelines, Docker configurations, Makefile targets, pre-commit hooks, and PR templates. Consistent CI pipelines and tooling adopted across repos with coding standards, resulting in reduced onboarding time from ~1 day to <30 minutes.",
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800&q=80",
    technologies: ["GitHub Actions", "Docker", "Makefile", "CI/CD", "DevOps"],
    category: "cloud",
    links: {
      github: "https://github.com/didier-building/devex-templates",
      live: null
    }
  },
  {
    id: 6,
    title: "Career Compass Platform",
    description: "Student application workflows platform with Django/DRF and JWT. Features registration, profiles, program catalogs, preference ranking, tracking, and rule-based eligibility/matching module with PostgreSQL/MySQL.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    technologies: ["Django", "DRF", "JWT", "PostgreSQL", "MySQL", "Docker"],
    category: "web",
    links: {
      github: "https://github.com/didier-building/career-compass",
      live: null
    }
  }
];

export const fallbackSkills = [
  // Backend Development
  { id: 1, name: "Python", category: "Backend Development", proficiency: 95 },
  { id: 2, name: "Django", category: "Backend Development", proficiency: 90 },
  { id: 3, name: "Django REST Framework", category: "Backend Development", proficiency: 90 },
  { id: 4, name: "SQL", category: "Backend Development", proficiency: 85 },
  { id: 5, name: "REST APIs", category: "Backend Development", proficiency: 85 },
  { id: 6, name: "Bash", category: "Backend Development", proficiency: 80 },
  
  // Testing & Quality
  { id: 7, name: "PyTest", category: "Testing & Quality", proficiency: 90 },
  { id: 8, name: "Unittest", category: "Testing & Quality", proficiency: 90 },
  { id: 9, name: "Integration Testing", category: "Testing & Quality", proficiency: 85 },
  { id: 10, name: "Debugging", category: "Testing & Quality", proficiency: 90 },
  { id: 11, name: "TDD", category: "Testing & Quality", proficiency: 85 },
  { id: 12, name: "Code Review", category: "Testing & Quality", proficiency: 85 },
  
  // Blockchain & Web3
  { id: 23, name: "Solidity", category: "Blockchain & Web3", proficiency: 75 },
  { id: 24, name: "Vyper", category: "Blockchain & Web3", proficiency: 70 },
  { id: 25, name: "Smart Contracts", category: "Blockchain & Web3", proficiency: 75 },
  { id: 26, name: "Web3.js", category: "Blockchain & Web3", proficiency: 70 },
  { id: 27, name: "Blockchain Fundamentals", category: "Blockchain & Web3", proficiency: 80 },
  
  // Database & Storage
  { id: 13, name: "PostgreSQL", category: "Database & Storage", proficiency: 85 },
  { id: 14, name: "MySQL", category: "Database & Storage", proficiency: 80 },
  { id: 15, name: "Database Optimization", category: "Database & Storage", proficiency: 80 },
  
  // DevOps & Cloud
  { id: 16, name: "Docker", category: "DevOps & Cloud", proficiency: 85 },
  { id: 17, name: "Kubernetes", category: "DevOps & Cloud", proficiency: 70 },
  { id: 18, name: "CI/CD Pipelines", category: "DevOps & Cloud", proficiency: 80 },
  { id: 19, name: "Linux Administration", category: "DevOps & Cloud", proficiency: 85 },
  { id: 20, name: "Git/GitHub", category: "DevOps & Cloud", proficiency: 90 },
  
  // Documentation
  { id: 21, name: "Technical Writing", category: "Documentation", proficiency: 90 },
  { id: 22, name: "API Documentation", category: "Documentation", proficiency: 85 }
];