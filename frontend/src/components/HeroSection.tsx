'use client'

import React, { useState } from 'react'
import { Mail, Download, Github, ExternalLink } from 'lucide-react'
import { SectionTitle } from './SectionTitle'
import { Typewriter } from './Typewriter'
import { portfolioData } from '@/data/portfolio'

export function HeroSection() {
  const [typewriterComplete, setTypewriterComplete] = useState(false)
  const { personal, achievements } = portfolioData

  return (
    <section id="whoami" className="min-h-[80vh] flex flex-col justify-center">
      <SectionTitle cmd="whoami" />
      
      <div className="space-y-8">
        {/* Name and Role with Typewriter */}
        <div className="space-y-4">
          <div className="text-4xl md:text-5xl font-bold">
            <Typewriter 
              text={personal.name}
              onComplete={() => setTypewriterComplete(true)}
              className="text-terminal-text"
            />
          </div>
          
          {typewriterComplete && (
            <div className="text-xl md:text-2xl text-terminal-text-dim font-mono animate-fade-in">
              {personal.role}
            </div>
          )}
        </div>

        {/* Summary */}
        {typewriterComplete && (
          <div className="text-lg text-terminal-text-dim max-w-3xl animate-slide-up">
            <span className="text-terminal-accent">Description:</span> {personal.summary}
          </div>
        )}

        {/* Key Achievements */}
        {typewriterComplete && (
          <div className="bg-terminal-bg-light border border-terminal-border rounded-lg p-6 max-w-4xl animate-slide-up">
            <h3 className="text-lg font-mono font-semibold text-terminal-accent mb-4">
              Key Achievements:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-terminal-accent mt-1 flex-shrink-0">→</span>
                  <span className="text-terminal-text-dim">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {typewriterComplete && (
          <div className="flex flex-wrap gap-4 animate-slide-up">
            <a
              href={`mailto:${personal.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-terminal-accent text-black font-mono font-semibold rounded-md hover:bg-terminal-accent-dim transition-colors focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
            >
              <Mail size={20} />
              Email Me
            </a>
            
            <a
              href={personal.cv}
              download
              className="inline-flex items-center gap-2 px-6 py-3 border border-terminal-accent text-terminal-accent font-mono font-semibold rounded-md hover:bg-terminal-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
            >
              <Download size={20} />
              Download CV
            </a>
            
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 border border-terminal-border text-terminal-text-dim hover:border-terminal-accent hover:text-terminal-accent font-mono font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
            >
              <ExternalLink size={20} />
              View Projects
            </a>
          </div>
        )}

        {/* Contact Info */}
        {typewriterComplete && (
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-terminal-text-dim font-mono animate-slide-up">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>{personal.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Github size={16} />
              <a 
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-terminal-accent transition-colors"
              >
                GitHub
              </a>
            </div>
            <div className="text-terminal-text-dim">
              📍 {personal.location}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}