'use client'

import React from 'react'
import { Server, Globe, Blocks, Cloud, Brain, Code } from 'lucide-react'
import { SectionTitle } from './SectionTitle'
import { portfolioData } from '@/data/portfolio'

const serviceIcons = {
  "Backend Development": <Server className="w-6 h-6" />,
  "Testing & Quality Assurance": <Code className="w-6 h-6" />,
  "Cloud & DevOps": <Cloud className="w-6 h-6" />,
  "Technical Documentation": <Globe className="w-6 h-6" />
}

export function ServicesSection() {
  const { services } = portfolioData

  return (
    <section id="help" className="py-16">
      <SectionTitle cmd="help" />
      
      <div className="space-y-4">
        <p className="text-terminal-text-dim font-mono mb-8">
          Available services and capabilities:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-terminal-bg-light border border-terminal-border rounded-lg p-6 hover:border-terminal-accent transition-colors group"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="text-terminal-accent group-hover:scale-110 transition-transform">
                  {serviceIcons[service.title as keyof typeof serviceIcons] || <Code className="w-6 h-6" />}
                </div>
                <h3 className="text-lg font-mono font-semibold text-terminal-text">
                  {service.title}
                </h3>
              </div>
              
              <p className="text-terminal-text-dim text-sm mb-4 font-mono">
                {service.description}
              </p>
              
              <div className="space-y-2">
                <div className="text-xs font-mono text-terminal-accent">Features:</div>
                <ul className="space-y-1">
                  {service.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex}
                      className="text-xs text-terminal-text-dim font-mono flex items-center gap-2"
                    >
                      <span className="text-terminal-accent">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-terminal-text-dim font-mono text-sm">
          <span className="text-terminal-accent">$</span> For more details about any service, contact me at{' '}
          <a 
            href={`mailto:${portfolioData.personal.email}`}
            className="text-terminal-accent hover:underline"
          >
            {portfolioData.personal.email}
          </a>
        </div>
      </div>
    </section>
  )
}