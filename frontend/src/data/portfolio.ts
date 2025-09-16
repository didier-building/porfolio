export interface Project {
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
  features?: string[];
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
}

export interface Experience {
  date: string;
  title: string;
  organization: string;
  description: string[];
  type: 'work' | 'education';
}

export interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  color: string;
}

export const portfolioData = {
  personal: {
    name: "Didier Imanirahari",
    role: "Backend/Full-Stack Engineer",
    summary: "Building Intelligent Software & Web3 Solutions",
    email: "didier53053@gmail.com",
    location: "Kigali/Remote",
    cv: "/cv/Didier_Imanirahari_CV.pdf",
    github: "https://github.com/didier-building",
    linkedin: "https://linkedin.com/in/didier-imanirahari",
  },
  
  projects: [
    {
      id: 1,
      title: "Order & Inventory Backend",
      description: "Django/DRF API with PostgreSQL modeling orders, stock, reservations, and status transitions. Features idempotent endpoints, Celery workers for pick/pack/dispatch, caching and batched queries, OpenAPI & Postman collection, Dockerized env with seed data.",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80",
      technologies: ["Django", "DRF", "PostgreSQL", "Celery", "Docker", "OpenAPI", "Redis"],
      category: "web" as const,
      links: {
        github: "https://github.com/didier-building/order-inventory-api",
        live: null
      },
      features: [
        "Idempotent REST endpoints",
        "Celery async workers",
        "PostgreSQL optimization",
        "OpenAPI documentation"
      ]
    },
    {
      id: 2,
      title: "Ops & Customer Support Dashboard",
      description: "React/TypeScript dashboard with Tailwind for order tracking, exception workflows, and customer messaging. Features server-side filtering/sorting/pagination, JWT auth, role-based access, audit logs, and error boundaries.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "TypeScript", "Tailwind", "JWT", "REST API"],
      category: "web" as const,
      links: {
        github: "https://github.com/didier-building/ops-dashboard",
        live: null
      },
      features: [
        "Server-side pagination",
        "JWT authentication",
        "Role-based access",
        "Real-time updates"
      ]
    },
    {
      id: 3,
      title: "AI-Enhanced Portfolio Platform",
      description: "React/TypeScript frontend with Django/DRF backend featuring 6 AI-powered tools: job matching, chat bot, career insights, CV generation. Production deployment with Docker, health monitoring, and analytics.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "TypeScript", "Django", "DRF", "AI/ML", "Docker"],
      category: "web" as const,
      links: {
        github: "https://github.com/didier-building/porfolio",
        live: "https://imanirahari.netlify.app"
      },
      features: [
        "6 AI-powered tools",
        "Production deployment",
        "Health monitoring",
        "Analytics integration"
      ]
    },
    {
      id: 4,
      title: "Blockchain Agricultural Supply Chain",
      description: "Capstone project designed with Django REST + Vyper smart contracts for produce tracking with ownership transfers and status updates. Features comprehensive unit tests for contract interactions and documented API/contract boundaries.",
      image: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=800&q=80",
      technologies: ["Django", "REST", "Vyper", "Blockchain", "Smart Contracts", "Testing"],
      category: "blockchain" as const,
      links: {
        github: "https://github.com/didier-building/agri-supply-chain",
        live: null
      },
      features: [
        "Smart contract integration",
        "Ownership tracking",
        "Status updates",
        "Comprehensive testing"
      ]
    },
    {
      id: 5,
      title: "DevEx Templates & Workflows",
      description: "Reusable GitHub Actions pipelines, Docker configurations, Makefile targets, pre-commit hooks, and PR templates. Consistent CI pipelines and tooling adopted across repos with coding standards, resulting in reduced onboarding time from ~1 day to <30 minutes.",
      image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800&q=80",
      technologies: ["GitHub Actions", "Docker", "Makefile", "CI/CD", "DevOps"],
      category: "cloud" as const,
      links: {
        github: "https://github.com/didier-building/devex-templates",
        live: null
      },
      features: [
        "Reusable workflows",
        "Automated CI/CD",
        "Pre-commit hooks",
        "Standardized templates"
      ]
    },
    {
      id: 6,
      title: "Career Compass Platform",
      description: "Student application workflows platform with Django/DRF and JWT. Features registration, profiles, program catalogs, preference ranking, tracking, and rule-based eligibility/matching module with PostgreSQL/MySQL.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      technologies: ["Django", "DRF", "JWT", "PostgreSQL", "MySQL", "Docker"],
      category: "web" as const,
      links: {
        github: "https://github.com/didier-building/career-compass",
        live: null
      },
      features: [
        "Application workflows",
        "Program matching",
        "Preference ranking",
        "Eligibility tracking"
      ]
    }
  ] as Project[],

  skills: [
    // Backend Development
    { id: 1, name: "Python", category: "Backend Development", proficiency: 95 },
    { id: 2, name: "Django", category: "Backend Development", proficiency: 90 },
    { id: 3, name: "Django REST Framework", category: "Backend Development", proficiency: 90 },
    { id: 4, name: "FastAPI", category: "Backend Development", proficiency: 70 },
    { id: 5, name: "REST/Webhooks", category: "Backend Development", proficiency: 85 },
    { id: 6, name: "Celery", category: "Backend Development", proficiency: 80 },
    { id: 7, name: "PyTest/UnitTest", category: "Backend Development", proficiency: 85 },
    
    // Frontend Development
    { id: 8, name: "React", category: "Frontend Development", proficiency: 85 },
    { id: 9, name: "TypeScript", category: "Frontend Development", proficiency: 90 },
    { id: 10, name: "JavaScript", category: "Frontend Development", proficiency: 85 },
    { id: 11, name: "Tailwind CSS", category: "Frontend Development", proficiency: 90 },
    { id: 12, name: "HTML/CSS", category: "Frontend Development", proficiency: 95 },
    { id: 13, name: "Next.js", category: "Frontend Development", proficiency: 75 },
    
    // Database & Storage
    { id: 14, name: "PostgreSQL", category: "Database & Storage", proficiency: 85 },
    { id: 15, name: "MySQL", category: "Database & Storage", proficiency: 80 },
    { id: 16, name: "Redis", category: "Database & Storage", proficiency: 75 },
    { id: 17, name: "SQLite", category: "Database & Storage", proficiency: 85 },
    
    // DevOps & Cloud
    { id: 18, name: "Docker", category: "DevOps & Cloud", proficiency: 85 },
    { id: 19, name: "Kubernetes", category: "DevOps & Cloud", proficiency: 70 },
    { id: 20, name: "GitHub Actions", category: "DevOps & Cloud", proficiency: 80 },
    { id: 21, name: "Linux", category: "DevOps & Cloud", proficiency: 85 },
    { id: 22, name: "Nginx", category: "DevOps & Cloud", proficiency: 75 },
    
    // Tools & Methodologies
    { id: 23, name: "Git/GitHub", category: "Tools & Methodologies", proficiency: 90 },
    { id: 24, name: "VS Code", category: "Tools & Methodologies", proficiency: 95 },
    { id: 25, name: "Postman", category: "Tools & Methodologies", proficiency: 85 },
    { id: 26, name: "Agile/Scrum", category: "Tools & Methodologies", proficiency: 80 },
  ] as Skill[],

  experience: [
    {
      date: '2021 – Present',
      title: 'Backend/Full-Stack Engineer',
      organization: 'Independent/Contract · Kigali/Remote',
      description: [
        'Designed and implemented Order & Inventory API (Django/DRF, PostgreSQL) with idempotent endpoints, Celery workers, and OpenAPI documentation',
        'Built Ops & Customer Support Dashboard (React/TypeScript, Tailwind) with server-side filtering, JWT auth, and exception workflows',
        'Enhanced DevEx with reusable workflows, pre-commit hooks, and ADRs - reduced onboarding from ~1 day to under 30 minutes',
        'Practiced Kubernetes deployments using Deployments/Services/Ingress with blue/green rollouts',
        'Collaborated with stakeholders to translate requirements into stable interfaces and delivery plans'
      ],
      type: 'work' as const,
    },
    {
      date: '2025',
      title: 'Team Lead',
      organization: 'GDG Kigali Hackathon (NLPAY Academy)',
      description: [
        'Led cross-functional team building AI learning platform in Kinyarwanda',
        'Shipped demo backend and React client with coordinated Git workflows',
        'Recognized for innovation and local impact in AI education'
      ],
      type: 'work' as const,
    },
    {
      date: '2024 – 2025',
      title: 'Capstone Project',
      organization: 'University of Rwanda',
      description: [
        'Designed Blockchain-Powered Agricultural Supply Chain with Django REST and Vyper smart contracts',
        'Implemented produce tracking with ownership transfers and status updates',
        'Developed comprehensive testing and API/contract documentation'
      ],
      type: 'education' as const,
    },
    {
      date: '10/2025',
      title: 'BSc, Computer & Software Engineering',
      organization: 'University of Rwanda',
      description: [
        'Bachelor\'s degree in Computer & Software Engineering',
        'Specialized in software architecture and distributed systems',
        'Graduated with distinction in systems design and implementation'
      ],
      type: 'education' as const,
    },
  ] as Experience[],

  achievements: [
    'Built order/inventory backends with idempotent REST APIs, async workflows (Celery), and DB tuning',
    'Shipped ops dashboards (React/TS) with role-based access, audit logs, and error boundaries', 
    'Improved developer workflows: cut setup time from ~1 day to <30 minutes',
    'Solid foundation in distributed systems, Linux/networking (CCNA), and Kubernetes (LFS250)'
  ],

  services: [
    {
      title: "Backend Development",
      description: "Robust APIs and server-side applications using Python, Django/DRF, and FastAPI with PostgreSQL/MySQL databases.",
      features: ["REST/GraphQL APIs", "Database Design", "Authentication & Security", "Performance Optimization"],
    },
    {
      title: "Frontend Development", 
      description: "Modern, responsive web applications using React, TypeScript, and Tailwind CSS with seamless user experiences.",
      features: ["React/TypeScript", "Responsive Design", "Modern UI/UX", "Progressive Web Apps"],
    },
    {
      title: "Blockchain & Web3",
      description: "Decentralized applications, smart contracts, and blockchain integration for next-generation solutions.",
      features: ["Smart Contracts", "DeFi Applications", "NFT Platforms", "Web3 Integration"],
    },
    {
      title: "Cloud & DevOps",
      description: "Scalable cloud infrastructure, containerization with Docker/Kubernetes, and automated CI/CD pipelines.",
      features: ["Docker/Kubernetes", "CI/CD Pipelines", "Cloud Deployment", "Infrastructure as Code"],
    },
    {
      title: "Data & AI Solutions",
      description: "Intelligent applications with AI/ML integration, data processing, and advanced analytics capabilities.",
      features: ["AI/ML Integration", "Data Processing", "Intelligent Automation", "Analytics Dashboards"],
    }
  ]
};