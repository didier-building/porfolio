import React from 'react';
import { Code, Cloud, Database, Server, Layout, Terminal, Users, Wrench } from 'lucide-react';
import { fallbackSkills } from '../data/projectsData';

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
    'Django REST Framework': <div className={iconClass}>🎸</div>,
    'React': <div className={iconClass}>⚛️</div>,
    'TypeScript': <div className={iconClass}>📘</div>,
    'JavaScript': <div className={iconClass}>📜</div>,
    'PostgreSQL': <div className={iconClass}>🐘</div>,
    'MySQL': <div className={iconClass}>🐬</div>,
    'Docker': <div className={iconClass}>🐳</div>,
    'Kubernetes': <div className={iconClass}>☸️</div>,
    'Git/GitHub': <div className={iconClass}>🔧</div>,
    'Linux': <div className={iconClass}>🐧</div>,
    'Tailwind CSS': <div className={iconClass}>🎨</div>,
    'FastAPI': <div className={iconClass}>⚡</div>,
    'Celery': <div className={iconClass}>🌾</div>,
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
    <div className="group relative bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-lg p-3 hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-500/50 transition-all duration-300 hover:scale-[1.02] transform-gpu h-32 flex flex-col">
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5 dark:from-teal-500/10 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header with title and level badge */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="flex-shrink-0">
              <TechIcon name={name} />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs leading-tight truncate">{name}</h4>
          </div>
          <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ml-1 ${levelColor}`}>
            {level}
          </span>
        </div>
        
        {/* Progress Ring - smaller and centered */}
        <div className="flex items-center justify-center flex-1 mb-2">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
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
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{proficiency}%</span>
            </div>
          </div>
        </div>
        
        {/* Projects tooltip - compact at bottom */}
        <div className="h-4 flex items-end">
          {projectsUsed.length > 0 && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
              <p className="text-xs text-slate-600 dark:text-slate-400 text-center leading-tight truncate">
                Used in: {projectsUsed.slice(0, 1).join(', ')}
                {projectsUsed.length > 1 && ` +${projectsUsed.length - 1}`}
              </p>
            </div>
          )}
        </div>
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
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Category Header - more compact */}
      <div className="flex items-center mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
        <div className="mr-3 p-2 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/40 dark:to-blue-900/40 rounded-lg text-teal-600 dark:text-teal-400 shadow-sm">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {skills.length} skill{skills.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      
      {/* Optimized grid with more items per row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 auto-rows-fr">
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
  // Use fallback skills directly for now since API is not working
  const skills = fallbackSkills;
  
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
    'Frontend': <Layout size={24} />,
    'Backend': <Code size={24} />,
    'DevOps': <Cloud size={24} />,
    'Database': <Database size={24} />,
    'Infrastructure': <Server size={24} />,
    'Collaboration': <Users size={24} />,
    'Blockchain': <Terminal size={24} />,
  };
  
  const skillCategories = Object.keys(skillsByCategory).map(category => ({
    title: category,
    icon: categoryIcons[category] || <Wrench size={24} />,
    skills: skillsByCategory[category],
  }));

  return (
    <section id="skills" className="py-12 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full text-sm font-medium mb-4">
            <Code size={16} />
            <span>Technical Expertise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Skills & Technologies
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Professional expertise across modern tech stack with hands-on project experience. 
            Each skill has been applied in real-world production environments.
          </p>
        </div>
        
        {/* Compact grid layout with reduced spacing */}
        <div className="space-y-6">
          {skillCategories.map((category, index) => (
            <SkillCategory
              key={index}
              title={category.title}
              icon={category.icon}
              skills={category.skills}
            />
          ))}
        </div>
        
        {/* Call to action - more compact */}
        <div className="text-center mt-8">
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
