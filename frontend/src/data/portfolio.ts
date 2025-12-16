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
    role: "Python Engineer | Backend & Testing Specialist",
    summary: "Building Scalable Backend Solutions with Rigorous Testing",
    email: "didier53053@gmail.com",
    location: "Kigali, Rwanda",
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
    { id: 22, name: "API Documentation", category: "Documentation", proficiency: 85 },
  ] as Skill[],

  experience: [
    {
      date: '2024 – Present',
      title: 'Software Engineer & Technical Support',
      organization: 'Bittwork Technologies Ltd · Kigali, Rwanda',
      description: [
        'Serving as a key technical resource for diagnosing and resolving complex code defects and system failures',
        'Developing scalable APIs using Django and implementing automated testing workflows to ensure solution verification',
        'Maintaining detailed technical documentation for root cause tracking, ensuring clarity and reproducibility of issues',
        'Optimizing Python code performance and database queries to handle increased load efficiently'
      ],
      type: 'work' as const,
    },
    {
      date: '2021 – 2024',
      title: 'Independent Python Developer',
      organization: 'Freelance · Remote',
      description: [
        'Architected and maintained modular backend systems for diverse clients, acting as the primary engineer for the full development lifecycle',
        'Wrote comprehensive unit and integration tests to validate business logic and edge cases for custom Python applications',
        'Refactored legacy codebases to improve readability and reliability, establishing strict coding standards',
        'Provided deployment support and detailed technical guides for remote teams'
      ],
      type: 'work' as const,
    },
    {
      date: '2025',
      title: 'Team Lead & Backend Developer',
      organization: 'GDG Kigali Hackathon (NLPAY Academy)',
      description: [
        'Led the development of an AI-powered platform, focusing on the accuracy and reliability of content delivery algorithms',
        'Engineered a robust Django backend and implemented test cases to verify the integrity of translation integrations'
      ],
      type: 'work' as const,
    },
    {
      date: '2024',
      title: 'Backend Collaborator',
      organization: 'Career Compass Project',
      description: [
        'Built a RESTful API with a focus on data validation and error handling',
        'Collaborated on code reviews to ensure strict adherence to style guides and best practices',
        'Integrated Docker to standardize the testing environment across the development team'
      ],
      type: 'work' as const,
    },
    {
      date: 'Oct 2025',
      title: 'BSc in Computer & Software Engineering',
      organization: 'University of Rwanda',
      description: [
        'Bachelor\'s degree in Computer & Software Engineering',
        'Awarded Government Scholarship for Academic Excellence',
        'Graduated October 2025'
      ],
      type: 'education' as const,
    },
  ] as Experience[],

  achievements: [
    'Over 4 years of hands-on experience in backend development, system architecture, and rigorous code testing',
    'Specialized in designing scalable solutions with comprehensive test suites using PyTest and Unittest',
    'Proven ability to debug complex issues in real-world repositories and provide detailed technical documentation',
    'Strong foundation in distributed systems, Linux/networking (CCNA), and Kubernetes (LFS250)'
  ],

  services: [
    {
      title: "Backend Development",
      description: "Robust APIs and server-side applications using Python, Django/DRF with PostgreSQL/MySQL databases. Focus on scalability, testing, and performance optimization.",
      features: ["REST APIs", "Database Design", "Authentication & Security", "Performance Optimization"],
    },
    {
      title: "Testing & Quality Assurance",
      description: "Comprehensive testing strategies using PyTest and Unittest. Writing test suites, debugging complex issues, and ensuring code reliability.",
      features: ["Unit Testing", "Integration Testing", "Test-Driven Development", "Code Review"],
    },
    {
      title: "Cloud & DevOps",
      description: "Scalable cloud infrastructure, containerization with Docker/Kubernetes, and automated CI/CD pipelines for reliable deployments.",
      features: ["Docker/Kubernetes", "CI/CD Pipelines", "Linux Administration", "Infrastructure as Code"],
    },
    {
      title: "Technical Documentation",
      description: "Clear and comprehensive technical documentation, API documentation, and detailed technical guides for development teams.",
      features: ["API Documentation", "Technical Writing", "Code Documentation", "System Architecture Docs"],
    }
  ]
};