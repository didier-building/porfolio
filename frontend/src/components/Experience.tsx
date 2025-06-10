import React from 'react';
import { Calendar, Briefcase, GraduationCap } from 'lucide-react';

interface TimelineItemProps {
  date: string;
  title: string;
  organization: string;
  description: string;
  icon: React.ReactNode;
  isLast?: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ 
  date, 
  title, 
  organization, 
  description, 
  icon,
  isLast = false 
}) => {
  return (
    <div className="relative flex gap-6">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-500 border-4 border-white dark:border-slate-950 z-10">
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
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
};

const Experience: React.FC = () => {
  const experiences = [
    {
      date: "2022 - Present",
      title: "Software Engineering Intern",
      organization: "Tech Innovations Inc.",
      description: "Developing cloud-native microservices using Kubernetes, Docker, and Go. Implementing CI/CD pipelines and monitoring solutions.",
      icon: <Briefcase size={24} />,
    },
    {
      date: "2021 - 2022",
      title: "Web Development Freelancer",
      organization: "Self-employed",
      description: "Built responsive web applications for various clients using React, Node.js, and MongoDB. Implemented payment processing and authentication systems.",
      icon: <Briefcase size={24} />,
    },
    {
      date: "2020 - Present",
      title: "B.S. in Computer Engineering",
      organization: "University of RWANDA",
      description: "Specializing in software systems and cloud computing. Relevant coursework includes distributed systems, cloud architecture, and web development.",
      icon: <GraduationCap size={24} />,
    },
    {
      date: "2020 - 2021",
      title: "Open Source Contributor",
      organization: "Various Projects",
      description: "Contributed to several open-source projects related to Kubernetes operators, React components, and developer tools.",
      icon: <Briefcase size={24} />,
    },
  ];

  return (
    <section id="experience" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Experience & Education</h2>
          <div className="w-20 h-1 bg-teal-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            My professional journey and educational background.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {experiences.map((experience, index) => (
            <TimelineItem
              key={index}
              date={experience.date}
              title={experience.title}
              organization={experience.organization}
              description={experience.description}
              icon={experience.icon}
              isLast={index === experiences.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;