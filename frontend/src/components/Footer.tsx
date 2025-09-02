import React from 'react';
import { Github, Twitter, Mail, ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="bg-primary-900 dark:bg-slate-900 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Portfolio<span className="text-primary-400">.</span></h3>
            <p className="text-slate-300 dark:text-slate-400 mb-4 max-w-sm">
              Creating innovative solutions through modern technologies and thoughtful design.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-300 dark:text-slate-400 hover:text-primary-400 transition-colors"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-300 dark:text-slate-400 hover:text-primary-400 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="mailto:didier53053@gmail.com.com" 
                className="text-slate-300 dark:text-slate-400 hover:text-primary-400 transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-1.5">
              <li>
                <a href="#home" className="text-slate-300 dark:text-slate-400 hover:text-primary-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="text-slate-300 dark:text-slate-400 hover:text-primary-400 transition-colors">About</a>
              </li>
              <li>
                <a href="#skills" className="text-slate-300 dark:text-slate-400 hover:text-primary-400 transition-colors">Skills</a>
              </li>
              <li>
                <a href="#projects" className="text-slate-300 dark:text-slate-400 hover:text-primary-400 transition-colors">Projects</a>
              </li>
              <li>
                <a href="#experience" className="text-slate-300 dark:text-slate-400 hover:text-primary-400 transition-colors">Experience</a>
              </li>
              <li>
                <a href="#contact" className="text-slate-300 dark:text-slate-400 hover:text-primary-400 transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Info</h3>
            <p className="text-slate-300 dark:text-slate-400 mb-2">
              Email: <a href="mailto:didier53053@gmail.com" className="hover:text-primary-400 transition-colors">didier53053@gmail.com</a>
            </p>
            <p className="text-slate-300 dark:text-slate-400">
              Based in: Kigali, RWANDA
            </p>
          </div>
        </div>
        
        <div className="border-t border-primary-800 dark:border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-300 dark:text-slate-400 text-sm mb-4 sm:mb-0">
            © {new Date().getFullYear()} IMANIRAHARI Didier. All rights reserved.
          </p>
          <button 
            onClick={scrollToTop}
            className="p-2 bg-primary-800 dark:bg-slate-800 hover:bg-primary-700 dark:hover:bg-slate-700 rounded-full transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} className="text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
