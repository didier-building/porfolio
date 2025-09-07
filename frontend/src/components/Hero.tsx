import React from 'react';
import { ArrowDown, Github, Twitter, Mail, Code, Briefcase } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden pt-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-lg rotate-45 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-primary-200 dark:bg-primary-800/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                <Code size={20} />
                <span className="text-sm font-medium tracking-wide uppercase">Full-Stack Engineer</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight">
                IMANIRAHARI 
                <span className="block text-primary-600 dark:text-primary-400">Didier</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 font-medium">
                Python | Django/DRF | Docker | Kubernetes
              </p>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl leading-relaxed">
              Results-oriented engineer focused on building reliable, production-style web platforms 
              that interact with the physical world (logistics, healthcare, education). Strong in 
              Python/Django APIs, React UIs, containerized deployments, and relational data modeling.
            </p>

            {/* Key Highlights from CV */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Key Achievements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Built order/inventory backends with idempotent REST APIs, async workflows (Celery), and DB tuning
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Shipped ops dashboards (React/TS) with role-based access, audit logs, and error boundaries
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Improved developer workflows: cut setup time from ~1 day to &lt;30 minutes
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Solid foundation in distributed systems, Linux/networking (CCNA), and Kubernetes (LFS250)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#skills" 
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <Code size={20} />
                View Skills
              </a>
              <a 
                href="#contact" 
                className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:border-primary-600 dark:hover:border-primary-500 font-semibold rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <Mail size={20} />
                Get In Touch
              </a>
            </div>
            
            <div className="flex items-center space-x-6 pt-4">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Connect with me:</span>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/didier-building"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transform hover:-translate-y-1"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://x.com/didier53053"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transform hover:-translate-y-1"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="mailto:didier53053@gmail.com"
                  className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transform hover:-translate-y-1"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>

            {/* Professional Contact Information */}
            <div className="flex flex-col sm:flex-row gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Mail size={16} />
                <span className="text-sm">didier53053@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <span className="text-sm">+250 782 953 053</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm">Kigali, Rwanda</span>
              </div>
            </div>
          </div>

          {/* Right side - Professional photo placeholder */}
          <div className="relative animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="relative">
              <div className="w-80 h-80 mx-auto bg-gradient-to-br from-primary-100 to-primary-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-6xl">👨‍💻</div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-100 dark:bg-accent-900/30 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary-200 dark:bg-primary-800/30 rounded-xl rotate-12 animate-float" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#skills" className="flex flex-col items-center text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <span className="text-sm font-medium mb-2">Scroll to explore</span>
            <ArrowDown size={24} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
