import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>Personal Story</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            About Me
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Beyond the code and technologies, here's the person behind the projects and the passion 
            that drives my continuous journey in software engineering.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Results-oriented engineer focused on building reliable, production-style web platforms 
                that interact with the physical world across logistics, healthcare, and education sectors. 
                I translate evolving, real-world requirements into maintainable systems, document decisions 
                clearly, and improve developer experience so teams move faster.
              </p>
              
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                My expertise spans <span className="text-teal-600 dark:text-teal-500 font-medium">Python/Django APIs</span>,
                <span className="text-teal-600 dark:text-teal-500 font-medium"> React UIs</span>, and
                <span className="text-teal-600 dark:text-teal-500 font-medium"> containerized deployments (Docker/Kubernetes)</span>. 
                I have a solid foundation in distributed systems, Linux/networking, and relational data modeling with PostgreSQL/MySQL.
              </p>
              
              <p className="text-slate-700 dark:text-slate-300">
                Currently pursuing BSc in Computer & Software Engineering at University of Rwanda while 
                collaborating on production systems. I'm comfortable with services, queues, caching, 
                retries, and observability - always focused on building systems that are ready to deploy 
                and scale in real-world environments.
              </p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Production Systems</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">API Design</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">DevOps Excellence</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Team Collaboration</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">System Architecture</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Performance Optimization</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Documentation Focus</span>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                <img 
                  src="/photo@@-1.jpg" 
                  alt="About me"
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;