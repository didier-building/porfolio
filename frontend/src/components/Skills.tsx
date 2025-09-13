import React from 'react';
import { Code, Cloud, Database, Server, Layout, Terminal, Users, Wrench } from 'lucide-react';
import { useSkills } from '../hooks/useSkills';

// Skill level helpers
const getSkillLevel = (proficiency: number): string => {
  if (proficiency >= 90) return 'Expert';
  if (proficiency >= 75) return 'Advanced';
  if (proficiency >= 50) return 'Intermediate';
  return 'Beginner';
};

const getSkillLevelColor = (proficiency: number): string => {
  if (proficiency >= 90) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
  if (proficiency >= 75) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
  if (proficiency >= 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
};

// Technology logos - using simple icon placeholders for now
const TechIcon: React.FC<{ name: string }> = ({ name }) => {
  const iconClass = "w-6 h-6 text-slate-600 dark:text-slate-400";
  
  const icons: Record<string, React.ReactNode> = {
    'Python': <div className={iconClass}>🐍</div>,
    'Django': <div className={iconClass}>🎸</div>,
    'React': <div className={iconClass}>⚛️</div>,
    'TypeScript': <div className={iconClass}>📘</div>,
    'PostgreSQL': <div className={iconClass}>🐘</div>,
    'Docker': <div className={iconClass}>🐳</div>,
    'Kubernetes': <div className={iconClass}>☸️</div>,
    'Git/GitHub': <div className={iconClass}>🔧</div>,
    'Linux': <div className={iconClass}>🐧</div>,
  };
  
  return icons[name] || <div className={iconClass}>⚡</div>;
};

const SkillCard: React.FC<{
  name: string;
  proficiency: number;
  projectsUsed?: string[];
}> = ({ name, proficiency, projectsUsed = [] }) => {
  const level = getSkillLevel(proficiency);
  const levelColor = getSkillLevelColor(proficiency);
  
  return (
    <div className="group relative bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-500/50 transition-all duration-300 hover:scale-[1.02] transform-gpu">
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5 dark:from-teal-500/10 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <TechIcon name={name} />
            <h4 className="font-semibold text-slate-900 dark:text-white">{name}</h4>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColor}`}>
            {level}
          </span>
        </div>
        
        {/* Progress Ring */}
        <div className="flex items-center justify-center mb-3">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-700"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-teal-500"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${proficiency}, 100`}
                strokeLinecap="round"
                fill="transparent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{proficiency}%</span>
            </div>
          </div>
        </div>
        
        {/* Tooltip on hover */}
        {projectsUsed.length > 0 && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
              Used in: {projectsUsed.slice(0, 2).join(', ')}
              {projectsUsed.length > 2 && ` +${projectsUsed.length - 2} more`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SkillCategory: React.FC<{
  title: string;
  icon: React.ReactNode;
  skills: { name: string; proficiency: number }[];
}> = ({ title, icon, skills }) => {
  // Mock project usage data - in real app this would come from API
  const getProjectsForSkill = (skillName: string): string[] => {
    const projectMap: Record<string, string[]> = {
      'Python': ['AI Portfolio', 'Order & Inventory API', 'Career Compass'],
      'Django': ['AI Portfolio', 'Order & Inventory API', 'Career Compass'],
      'React': ['AI Portfolio', 'Ops Dashboard', 'Career Compass'],
      'TypeScript': ['AI Portfolio', 'Ops Dashboard'],
      'PostgreSQL': ['Order & Inventory API', 'Career Compass'],
      'Docker': ['AI Portfolio', 'Order & Inventory API', 'DevEx Templates'],
      'Kubernetes': ['Cloud Infrastructure', 'DevEx Templates'],
      'Git/GitHub': ['All Projects'],
    };
    return projectMap[skillName] || [];
  };
  
  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="flex items-center mb-6">
        <div className="mr-4 p-3 bg-teal-100 dark:bg-teal-900/30 rounded-xl text-teal-600 dark:text-teal-400">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill, index) => (
          <SkillCard
            key={index}
            name={skill.name}
            proficiency={skill.proficiency}
            projectsUsed={getProjectsForSkill(skill.name)}
          />
        ))}
      </div>
    </div>
  );
};

const Skills: React.FC = () => {
  const { skills, loading, error } = useSkills();
  
  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-10 text-red-500">{error}</div>
  );
  
  // Enhanced skill categorization with better names
  const categoryMapping: Record<string, string> = {
    'Backend Development': 'Backend',
    'Frontend Development': 'Frontend', 
    'Database': 'Database',
    'Cloud & DevOps': 'DevOps',
    'Infrastructure': 'Infrastructure',
    'Collaboration': 'Collaboration',
    'Blockchain': 'Blockchain'
  };

  // Group skills by category with updated proficiency values
  const skillsByCategory = skills.reduce((acc, skill) => {
    const categoryKey = categoryMapping[skill.category] || skill.category;
    if (!acc[categoryKey]) {
      acc[categoryKey] = [];
    }
    acc[categoryKey].push({ 
      name: skill.name, 
      proficiency: skill.proficiency // Use direct proficiency value
    });
    return acc;
  }, {} as Record<string, { name: string; proficiency: number }[]>);
  
  // Enhanced category icons mapping
  const categoryIcons: Record<string, React.ReactNode> = {
    'Frontend': <Layout size={28} />,
    'Backend': <Code size={28} />,
    'DevOps': <Cloud size={28} />,
    'Database': <Database size={28} />,
    'Infrastructure': <Server size={28} />,
    'Collaboration': <Users size={28} />,
    'Blockchain': <Terminal size={28} />,
  };
  
  const skillCategories = Object.keys(skillsByCategory).map(category => ({
    title: category,
    icon: categoryIcons[category] || <Wrench size={28} />,
    skills: skillsByCategory[category],
  }));

  return (
    <section id="skills" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full text-sm font-medium mb-4">
            <Code size={16} />
            <span>Technical Expertise</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Skills & Technologies
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Professional expertise across modern tech stack with hands-on project experience. 
            Each skill has been applied in real-world production environments.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <SkillCategory
              key={index}
              title={category.title}
              icon={category.icon}
              skills={category.skills}
            />
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-slate-600 dark:text-slate-400">Want to see these skills in action?</span>
            <a 
              href="#projects" 
              className="text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
            >
              View Projects →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
