import React from 'react';
import { Calendar, BookOpen, Code, Lightbulb } from 'lucide-react';
import Meta from './Meta';

interface JournalEntry {
  id: number;
  title: string;
  date: string;
  category: 'Technical' | 'Career' | 'Learning' | 'Project';
  summary: string;
  tags: string[];
}

const journalEntries: JournalEntry[] = [
  {
    id: 1,
    title: "Building a Modern Portfolio with React and TypeScript",
    date: "2024-01-15",
    category: "Technical",
    summary: "Detailed walkthrough of architecting a responsive portfolio using React 18, TypeScript, and Tailwind CSS. Covering component optimization, lazy loading, and modern development practices.",
    tags: ["React", "TypeScript", "Performance", "Architecture"]
  },
  {
    id: 2,
    title: "Microservices Architecture: Lessons from Production",
    date: "2024-01-08",
    category: "Technical",
    summary: "Real-world insights from implementing microservices in production. Discussing service communication, data consistency, monitoring, and the challenges of distributed systems.",
    tags: ["Microservices", "Backend", "Architecture", "DevOps"]
  },
  {
    id: 3,
    title: "The Journey to Senior Engineering: Technical Leadership",
    date: "2023-12-20",
    category: "Career",
    summary: "Reflections on transitioning from individual contributor to technical leadership. Exploring mentorship, system design decisions, and balancing technical depth with strategic thinking.",
    tags: ["Leadership", "Career Growth", "Mentorship", "Strategy"]
  },
  {
    id: 4,
    title: "AI Integration in Modern Web Applications",
    date: "2023-12-05",
    category: "Learning",
    summary: "Exploring practical AI integration patterns in web applications. From ChatGPT API integration to building intelligent features that enhance user experience.",
    tags: ["AI", "Integration", "UX", "Innovation"]
  },
  {
    id: 5,
    title: "Code Review Culture: Building Better Software Together",
    date: "2023-11-22",
    category: "Technical",
    summary: "Best practices for effective code reviews that improve code quality while fostering team collaboration. Strategies for giving constructive feedback and creating psychological safety.",
    tags: ["Code Review", "Team Culture", "Quality", "Collaboration"]
  }
];

const categoryIcons = {
  Technical: Code,
  Career: Lightbulb,
  Learning: BookOpen,
  Project: Calendar
};

const categoryColors = {
  Technical: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
  Career: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
  Learning: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400",
  Project: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400"
};

export default function Journal() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
      <Meta title="Journal" description="Technical insights, career reflections, and professional development journey" />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Technical Journal
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Insights from my journey in software engineering, technical leadership, and continuous learning.
          </p>
        </div>

        <div className="space-y-8">
          {journalEntries.map((entry) => {
            const IconComponent = categoryIcons[entry.category];
            return (
              <article
                key={entry.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${categoryColors[entry.category]}`}>
                    <IconComponent size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColors[entry.category]}`}>
                        {entry.category}
                      </span>
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <Calendar size={14} className="mr-1" />
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {entry.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                      {entry.summary}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600 dark:text-slate-400">
            More insights and technical articles coming soon. Follow my journey in software engineering and technical leadership.
          </p>
        </div>
      </div>
    </div>
  );
}
