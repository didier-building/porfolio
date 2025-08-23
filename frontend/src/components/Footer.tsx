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
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Portfolio<span className="text-teal-500">.</span></h3>
            <p className="text-slate-400 mb-6 max-w-sm">
              Creating innovative solutions through modern technologies and thoughtful design.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="mailto:contact@example.com" 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-slate-400 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="text-slate-400 hover:text-white transition-colors">About</a>
              </li>
              <li>
                <a href="#skills" className="text-slate-400 hover:text-white transition-colors">Skills</a>
              </li>
              <li>
                <a href="#projects" className="text-slate-400 hover:text-white transition-colors">Projects</a>
              </li>
              <li>
                <a href="#experience" className="text-slate-400 hover:text-white transition-colors">Experience</a>
              </li>
              <li>
                <a href="#contact" className="text-slate-400 hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <p className="text-slate-400 mb-2">
              Email: <a href="mailto:contact@example.com" className="hover:text-white transition-colors">contact@example.com</a>
            </p>
            <p className="text-slate-400">
              Based in: San Francisco, CA
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm mb-4 sm:mb-0">
            © {new Date().getFullYear()} IMANIRAHARI Didier. All rights reserved.
          </p>
          <button 
            onClick={scrollToTop}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
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
