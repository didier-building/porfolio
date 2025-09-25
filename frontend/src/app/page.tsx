'use client'

import React, { useEffect, Suspense } from 'react'
import { TerminalFrame } from '@/components/TerminalFrame'
import { ThemeToggle } from '@/components/ThemeToggle'
import { HeroSection } from '@/components/HeroSection'
import { ServicesSection } from '@/components/ServicesSection'
import { SkillsSection } from '@/components/SkillsSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { ContactSection } from '@/components/ContactSection'
import { AISecretary } from '@/components/AISecretary'
import { initTheme } from '@/lib/utils'

function PortfolioContent() {
  useEffect(() => {
    initTheme()
  }, [])

  return (
    <TerminalFrame>
      <ThemeToggle />
      
      <div className="space-y-16">
        {/* Hero - $ whoami */}
        <HeroSection />
        
        {/* Services - $ help */}
        <ServicesSection />
        
        {/* Skills - $ skills --list */}
        <Suspense fallback={<div className="text-terminal-text-dim">Loading skills...</div>}>
          <SkillsSection />
        </Suspense>
        
        {/* Experience - $ history */}
        <ExperienceSection />
        
        {/* Projects - $ ls projects/ */}
        <Suspense fallback={<div className="text-terminal-text-dim">Loading projects...</div>}>
          <ProjectsSection />
        </Suspense>
        
        {/* Contact - $ contact --open */}
        <ContactSection />
        
        {/* Terminal footer */}
        <footer className="py-8 border-t border-terminal-border">
          <div className="text-center text-terminal-text-dim font-mono text-sm">
            <div className="mb-2">
              <span className="text-terminal-accent">$</span> echo &quot;Made with ❤️ using Next.js, TypeScript, and Tailwind CSS&quot;
            </div>
            <div className="text-xs">
              © 2024 Didier Imanirahari. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
      
      {/* AI Secretary - Floating Chat */}
      <AISecretary />
    </TerminalFrame>
  )
}

export default function HomePage() {
  return <PortfolioContent />
}