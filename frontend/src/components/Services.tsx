import React from 'react';
import { Server, Globe, Blocks, Cloud, Brain, Code, Mail } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: <Server className="w-8 h-8" />,
      title: "Backend Development",
      description: "Robust APIs and server-side applications using Python, Django/DRF, and FastAPI with PostgreSQL/MySQL databases.",
      features: ["REST/GraphQL APIs", "Database Design", "Authentication & Security", "Performance Optimization"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Frontend Development", 
      description: "Modern, responsive web applications using React, TypeScript, and Tailwind CSS with seamless user experiences.",
      features: ["React/TypeScript", "Responsive Design", "Modern UI/UX", "Progressive Web Apps"],
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: <Blocks className="w-8 h-8" />,
      title: "Blockchain & Web3",
      description: "Decentralized applications, smart contracts, and blockchain integration for next-generation solutions.",
      features: ["Smart Contracts", "DeFi Applications", "NFT Platforms", "Web3 Integration"],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud & DevOps",
      description: "Scalable cloud infrastructure, containerization with Docker/Kubernetes, and automated CI/CD pipelines.",
      features: ["Docker/Kubernetes", "CI/CD Pipelines", "Cloud Deployment", "Infrastructure as Code"],
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Data & AI Solutions",
      description: "Intelligent applications with AI/ML integration, data processing, and advanced analytics capabilities.",
      features: ["AI/ML Integration", "Data Processing", "Intelligent Automation", "Analytics Dashboards"],
      color: "from-pink-500 to-pink-600"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-6">
            <Code size={16} />
            <span>What I Do</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Professional <span className="text-gradient-teal">Services</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Comprehensive technology solutions from concept to deployment, specializing in modern web development and intelligent systems.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group relative bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${service.color} text-white rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <div className={`w-2 h-2 bg-gradient-to-r ${service.color} rounded-full mr-3 flex-shrink-0`}></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-gradient rounded-2xl transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to Build Something Amazing?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              Let's discuss your project and explore how these services can help bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#contact" 
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Start a Project
              </a>
              <a 
                href="#projects" 
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Code className="w-5 h-5" />
                View Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;