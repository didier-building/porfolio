import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="group relative p-3 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-200 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-500 transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
      aria-label="Toggle dark mode"
    >
      {/* 3D effect background */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 to-transparent dark:from-white/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Icon container with 3D flip animation */}
      <div className="relative w-5 h-5 transform-gpu">
        <div 
          className={`absolute inset-0 transition-all duration-700 transform-gpu ${
            theme === 'dark' 
              ? 'rotate-y-180 opacity-0' 
              : 'rotate-y-0 opacity-100'
          }`}
          style={{ 
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        >
          <Moon 
            size={20} 
            className="drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300" 
          />
        </div>
        
        <div 
          className={`absolute inset-0 transition-all duration-700 transform-gpu ${
            theme === 'dark' 
              ? 'rotate-y-0 opacity-100' 
              : 'rotate-y-180 opacity-0'
          }`}
          style={{ 
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        >
          <Sun 
            size={20} 
            className="drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300 text-amber-500" 
          />
        </div>
      </div>
      
      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-100 bg-gradient-to-r from-teal-400/20 to-blue-400/20 transition-opacity duration-150" />
    </button>
  );
};

export default ThemeToggle;