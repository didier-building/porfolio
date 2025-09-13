import React from 'react';
import { User, GraduationCap, Award, Calendar, MapPin, Mail, Phone } from 'lucide-react';

const About: React.FC = () => {
  const education = [
    {
      year: "2021 - 2025",
      title: "BSc, Computer & Software Engineering",
      institution: "University of Rwanda",
      description: "Government of Rwanda full scholarship for academic excellence",
      type: "education"
    },
    {
      year: "May 2025",
      title: "Kubernetes & Cloud Native Essentials (LFS250)",
      institution: "The Linux Foundation", 
      description: "Advanced certification in Kubernetes container orchestration",
      type: "certification"
    },
    {
      year: "Mar 2023",
      title: "CCNA v7: Enterprise Networking, Security & Automation",
      institution: "Cisco Networking Academy",
      description: "Professional certification in enterprise networking and security",
      type: "certification"
    },
    {
      year: "Aug 2022",
      title: "CCNA v7: Introduction to Networks", 
      institution: "Cisco Networking Academy",
      description: "Foundation certification in networking concepts",
      type: "certification"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-4">
            <User size={16} />
            <span>Get to Know Me</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            About <span className="text-gradient-teal">Me</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            The person behind the code, passionate about building intelligent solutions that make a real-world impact.
          </p>
        </div>
        
        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
          {/* Left Side - Profile & Summary */}
          <div className="order-2 lg:order-1">
            {/* Profile Photo */}
            <div className="relative mb-8">
              <div className="relative w-80 h-80 mx-auto lg:mx-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl blur-xl opacity-30"></div>
                <div className="relative overflow-hidden rounded-2xl border-4 border-white dark:border-slate-800 shadow-2xl">
                  <img 
                    src="/photo@@-1.jpg" 
                    alt="Didier Imanirahari"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-teal-500 to-blue-600 dark:from-teal-600 dark:to-blue-700 items-center justify-center text-white hidden">
                    <div className="text-center">
                      <User size={64} className="mx-auto mb-4 opacity-80" />
                      <p className="text-lg font-medium">Didier Imanirahari</p>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-100 dark:bg-purple-500/20 rounded-full animate-float shadow-lg dark:shadow-purple-500/20" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary-200 dark:bg-teal-500/20 rounded-xl rotate-12 animate-float shadow-lg dark:shadow-teal-500/20" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg flex items-center justify-center">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">didier53053@gmail.com</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg flex items-center justify-center">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">+250 782 953 053</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 sm:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg flex items-center justify-center">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Kigali, Rwanda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Professional Summary */}
          <div className="order-1 lg:order-2">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Professional Summary
              </h3>
              
              <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                Results-oriented engineer focused on building reliable, production-style web platforms 
                that interact with the physical world across logistics, healthcare, and education sectors. 
                I translate evolving, real-world requirements into maintainable systems, document decisions 
                clearly, and improve developer experience so teams move faster.
              </p>
              
              <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                My expertise spans <span className="text-teal-600 dark:text-teal-500 font-medium">Python/Django APIs</span>,
                <span className="text-teal-600 dark:text-teal-500 font-medium"> React UIs</span>, and
                <span className="text-teal-600 dark:text-teal-500 font-medium"> containerized deployments (Docker/Kubernetes)</span>. 
                I have a solid foundation in distributed systems, Linux/networking, and relational data modeling with PostgreSQL/MySQL.
              </p>
              
              <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                Currently pursuing BSc in Computer & Software Engineering at University of Rwanda while 
                collaborating on production systems. I'm comfortable with services, queues, caching, 
                retries, and observability - always focused on building systems that are ready to deploy 
                and scale in real-world environments.
              </p>

              {/* Key Strengths */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-900/50 dark:to-blue-900/20 rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Core Strengths</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Production Systems",
                    "API Design", 
                    "DevOps Excellence",
                    "Team Collaboration",
                    "System Architecture",
                    "Performance Optimization",
                    "Documentation Focus",
                    "Continuous Learning"
                  ].map((strength, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full"></div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Education & Certifications Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
              <GraduationCap size={16} />
              <span>Education & Certifications</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
              Academic <span className="text-gradient-teal">Journey</span>
            </h3>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-0.5 w-0.5 h-full bg-gradient-to-b from-teal-500 to-blue-600"></div>
            
            {education.map((item, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                {/* Timeline dot */}
                <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 z-10">
                  <div className={`w-full h-full rounded-full ${item.type === 'education' ? 'bg-teal-500' : 'bg-blue-500'}`}></div>
                </div>
                
                {/* Content */}
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} ml-16 md:ml-0`}>
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-shadow duration-300">
                    {/* Year badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        item.type === 'education' 
                          ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      }`}>
                        {item.type === 'education' ? <GraduationCap size={12} /> : <Award size={12} />}
                        <span>{item.year}</span>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {item.title}
                    </h4>
                    <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                      {item.institution}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;