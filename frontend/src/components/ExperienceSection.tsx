'use client'

import React from 'react'
import { Briefcase, GraduationCap } from 'lucide-react'
import { SectionTitle } from './SectionTitle'
import { portfolioData } from '@/data/portfolio'

export function ExperienceSection() {
  const { experience } = portfolioData

  return (
    <section id="history" className="py-16">
      <SectionTitle cmd="history" />
      
      <div className="space-y-8">
        {experience.map((exp, index) => (
          <div
            key={index}
            className="border-l-2 border-terminal-border pl-6 relative"
          >
            {/* Timeline dot */}
            <div className="absolute -left-2 top-0 w-4 h-4 bg-terminal-accent rounded-full border-2 border-terminal-bg"></div>
            
            <div className="space-y-3">
              {/* Command header */}
              <div className="font-mono">
                <span className="text-terminal-accent">$</span>
                <span className="text-terminal-text"> history add --role </span>
                <span className="text-terminal-accent">&quot;{exp.title}&quot;</span>
                <span className="text-terminal-text"> --org </span>
                <span className="text-terminal-accent">&quot;{exp.organization}&quot;</span>
              </div>
              
              {/* Date and type */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2 text-terminal-text-dim">
                  {exp.type === 'work' ? (
                    <Briefcase size={16} />
                  ) : (
                    <GraduationCap size={16} />
                  )}
                  <span className="font-mono">{exp.date}</span>
                </div>
                <span className="text-terminal-accent font-mono text-xs">
                  {exp.type === 'work' ? 'WORK' : 'EDUCATION'}
                </span>
              </div>
              
              {/* Description */}
              <div className="space-y-2 ml-4">
                {exp.description.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-2 text-sm">
                    <span className="text-terminal-accent mt-1 flex-shrink-0">•</span>
                    <span className="text-terminal-text-dim font-mono">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-8 text-terminal-text-dim font-mono text-sm">
          <span className="text-terminal-accent">$</span> history --help: Chronological overview of professional experience and education
        </div>
      </div>
    </section>
  )
}