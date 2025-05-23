import React from 'react';
import { Code, Cloud, Database, Server, Layout, Terminal } from 'lucide-react';

const SkillCategory: React.FC<{
  title: string;
  icon: React.ReactNode;
  skills: { name: string; level: number }[];
}> = ({ title, icon, skills }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        <div className="mr-3 text-teal-600 dark:text-teal-500">{icon}</div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{skill.name}</span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{skill.level * 10}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full" 
                style={{ width: `${skill.level * 10}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Skills: React.FC = () => {
  const skillCategories = [
    {
      title: 'Frontend Development',
      icon: <Layout size={24} />,
      skills: [
        { name: 'HTML/CSS', level: 9 },
        { name: 'JavaScript', level: 8.5 },
        { name: 'React', level: 8 },
        { name: 'TypeScript', level: 7.5 },
      ],
    },
    {
      title: 'Backend Development',
      icon: <Code size={24} />,
      skills: [
        { name: 'Node.js', level: 8 },
        { name: 'Python', level: 7 },
        { name: 'Go', level: 6 },
        { name: 'Java', level: 7 },
      ],
    },
    {
      title: 'Cloud & DevOps',
      icon: <Cloud size={24} />,
      skills: [
        { name: 'AWS', level: 7.5 },
        { name: 'Docker', level: 8 },
        { name: 'Kubernetes', level: 7 },
        { name: 'CI/CD', level: 7.5 },
      ],
    },
    {
      title: 'Database',
      icon: <Database size={24} />,
      skills: [
        { name: 'SQL', level: 8 },
        { name: 'MongoDB', level: 7.5 },
        { name: 'Redis', level: 6.5 },
        { name: 'PostgreSQL', level: 7 },
      ],
    },
    {
      title: 'Infrastructure',
      icon: <Server size={24} />,
      skills: [
        { name: 'Terraform', level: 7 },
        { name: 'Ansible', level: 6.5 },
        { name: 'Networking', level: 6 },
        { name: 'Security', level: 6.5 },
      ],
    },
    {
      title: 'Blockchain',
      icon: <Terminal size={24} />,
      skills: [
        { name: 'Solidity', level: 6 },
        { name: 'Web3.js', level: 5.5 },
        { name: 'Smart Contracts', level: 6 },
        { name: 'DApps', level: 5 },
      ],
    },
  ];

  return (
    <section id="skills" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">My Skills</h2>
          <div className="w-20 h-1 bg-teal-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            I've worked with a variety of technologies and frameworks. Here's an overview of my technical expertise.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <SkillCategory
              key={index}
              title={category.title}
              icon={category.icon}
              skills={category.skills}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;