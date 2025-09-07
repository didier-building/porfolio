import React from 'react';
import { Calendar, Briefcase, GraduationCap, Award } from 'lucide-react';

interface TimelineItemProps {
  date: string;
  title: string;
  organization: string;
  description: string | string[];
  icon: React.ReactNode;
  isLast?: boolean;
  type: 'work' | 'education' | 'certification';
}

const TimelineItem: React.FC<TimelineItemProps> = ({ 
  date, 
  title, 
  organization, 
  description, 
  icon,
  isLast = false,
  type
}) => {
  const getTypeColor = () => {
    switch (type) {
      case 'work': return 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-500';
      case 'education': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500';
      case 'certification': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-500';
      default: return 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-500';
    }
  };

  return (
    <div className="relative flex gap-6">
      <div className="flex flex-col items-center">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getTypeColor()} border-4 border-white dark:border-slate-950 z-10`}>
          {icon}
        </div>
        {!isLast && (
          <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700 mt-3"></div>
        )}
      </div>
      
      <div className="pb-12">
        <div className="flex items-center mb-1">
          <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
            <Calendar size={16} className="mr-1" />
            {date}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-teal-600 dark:text-teal-500 font-medium mb-2">{organization}</p>
        
        {Array.isArray(description) ? (
          <ul className="text-slate-600 dark:text-slate-400 space-y-1">
            {description.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-teal-600 mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-600 dark:text-slate-400">{description}</p>
        )}
      </div>
    </div>
  );
};

const Experience: React.FC = () => {
  const experiences = [
    {
      date: '2025 – Present',
      title: 'Backend Collaborator',
      organization: 'Career Compass (Student Applications & Recommendations)',
      description: [
        'Co-building student application workflows (registration, profiles, program catalogs, preference ranking, tracking) with Django/DRF and JWT',
        'Implemented a rule-based eligibility/matching module using PostgreSQL/MySQL and Docker',
        'Planning CI/CD implementation with GitHub Actions for automated deployment'
      ],
      icon: <Briefcase size={20} />,
      type: 'work' as const,
    },
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
      icon: <Briefcase size={20} />,
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
      icon: <Award size={20} />,
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
      icon: <GraduationCap size={20} />,
      type: 'education' as const,
    },
    {
      date: '10/2025',
      title: 'BSc, Computer & Software Engineering',
      organization: 'University of Rwanda',
      description: [
        'Government of Rwanda full scholarship for academic excellence',
        'Coursework: Data Structures & Algorithms, Databases, Distributed Systems, Blockchain Development, AI/ML Fundamentals'
      ],
      icon: <GraduationCap size={20} />,
      type: 'education' as const,
    },
    {
      date: 'May 2025',
      title: 'Kubernetes & Cloud Native Essentials (LFS250)',
      organization: 'The Linux Foundation',
      description: 'Advanced certification in Kubernetes container orchestration and cloud-native technologies',
      icon: <Award size={20} />,
      type: 'certification' as const,
    },
    {
      date: 'Mar 2023',
      title: 'CCNAv7: Enterprise Networking, Security & Automation',
      organization: 'Cisco Networking Academy',
      description: 'Professional certification in enterprise networking, security protocols, and network automation',
      icon: <Award size={20} />,
      type: 'certification' as const,
    },
    {
      date: 'Aug 2022',
      title: 'CCNAv7: Introduction to Networks',
      organization: 'Cisco Networking Academy',
      description: 'Foundation certification in networking concepts and technologies',
      icon: <Award size={20} />,
      type: 'certification' as const,
    },
    {
      date: 'Nov 2021',
      title: 'IT Essentials: PC Hardware & Software',
      organization: 'Cisco Networking Academy',
      description: 'Fundamental certification in computer hardware and software troubleshooting',
      icon: <Award size={20} />,
      type: 'certification' as const,
    },
  ];

  return (
    <section id="experience" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-4">
            <Briefcase size={16} />
            <span>Professional Journey</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Experience & Achievements
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Building production-ready systems through hands-on experience in full-stack development, 
            team leadership, and continuous learning in cutting-edge technologies.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {experiences.map((experience, index) => (
            <TimelineItem
              key={index}
              date={experience.date}
              title={experience.title}
              organization={experience.organization}
              description={experience.description}
              icon={experience.icon}
              type={experience.type}
              isLast={index === experiences.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;