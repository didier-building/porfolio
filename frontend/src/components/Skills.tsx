import React from 'react';
import { Code, Cloud, Database, Server, Layout, Terminal } from 'lucide-react';
import { useSkills } from '../hooks/useSkills';

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
  const { skills, loading, error } = useSkills();
  
  if (loading) return <div className="text-center py-10">Loading skills...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push({ name: skill.name, level: skill.proficiency / 10 });
    return acc;
  }, {} as Record<string, { name: string; level: number }[]>);
  
  // Map categories to icons
  const categoryIcons: Record<string, React.ReactNode> = {
    'Frontend Development': <Layout size={24} />,
    'Backend Development': <Code size={24} />,
    'Cloud & DevOps': <Cloud size={24} />,
    'Database': <Database size={24} />,
    'Infrastructure': <Server size={24} />,
    'Blockchain': <Terminal size={24} />,
  };
  
  const skillCategories = Object.keys(skillsByCategory).map(category => ({
    title: category,
    icon: categoryIcons[category] || <Code size={24} />,
    skills: skillsByCategory[category],
  }));

  return (
    <section id="skills" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-4">
            <Code size={16} />
            <span>Technical Expertise</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Skills & Technologies
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Proficient in modern web technologies with hands-on experience building scalable applications. 
            Continuously expanding expertise in emerging technologies and best practices.
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
