import React from 'react';
import { ArrowDown, Github, Twitter, Mail } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden pt-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_25%_at_50%_50%,var(--tw-gradient-from)_0%,var(--tw-gradient-to)_100%)] from-teal-50 to-white dark:from-slate-900/50 dark:to-slate-950"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-medium text-teal-600 dark:text-teal-500">
                Hello, I'm
              </h2>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white">
                Didier IMANIRAHARI
              </h1>
              <h3 className="text-xl sm:text-2xl font-medium text-slate-700 dark:text-slate-300">
                Developer
              </h3>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl leading-relaxed">
              Project-driven developer with interests in Python/Django, blockchain basics, and web automation.
            </p>
            
            <div className="flex space-x-4">
              <a 
                href="#projects" 
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
              >
                View Projects
              </a>
              <a 
                href="#contact" 
                className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 hover:border-teal-600 dark:hover:border-teal-500 font-medium rounded-lg transition-colors"
              >
                Contact Me
              </a>
            </div>
            
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com/didier-building"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                <Github size={24} />
              </a>
              <a
                href="https://x.com/didier53053"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                <Twitter size={24} />
              </a>
              <a
                href="mailto:didier53053@gmail.com"
                className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-8 border border-slate-200 dark:border-slate-800">
              <div className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <img 
                  src="https://images.pexels.com/photos/3785927/pexels-photo-3785927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Developer"
                  className="object-cover w-full h-full rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#about" aria-label="Scroll down">
          <ArrowDown className="text-slate-600 dark:text-slate-400" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
