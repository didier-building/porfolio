'use client'

import React, { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { SectionTitle } from './SectionTitle'
import { CaseCard } from './CaseCard'
import { portfolioData } from '@/data/portfolio'

export function ProjectsSection() {
  const searchParams = useSearchParams()
  const { projects } = portfolioData

  // Get selected skills from URL
  const selectedSkills = useMemo(() => {
    const skillsParam = searchParams.get('skills')
    return skillsParam ? skillsParam.split(',').filter(Boolean) : []
  }, [searchParams])

  // Filter projects based on selected skills
  const filteredProjects = useMemo(() => {
    if (selectedSkills.length === 0) {
      return projects
    }
    
    return projects.filter(project =>
      selectedSkills.some(skill =>
        project.technologies.some(tech =>
          tech.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(tech.toLowerCase())
        )
      )
    )
  }, [projects, selectedSkills])

  return (
    <section id="projects" className="py-16">
      <SectionTitle cmd="ls projects/" />
      
      <div className="space-y-6">
        {/* Project count and filter info */}
        <div className="text-terminal-text-dim font-mono text-sm">
          {selectedSkills.length > 0 ? (
            <div className="space-y-1" aria-live="polite">
              <div>
                <span className="text-terminal-accent">Filtered by:</span> {selectedSkills.join(', ')}
              </div>
              <div>
                <span className="text-terminal-accent">Showing:</span> {filteredProjects.length} of {projects.length} projects
              </div>
            </div>
          ) : (
            <div>
              <span className="text-terminal-accent">Total projects:</span> {projects.length}
            </div>
          )}
        </div>

        {/* Projects grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <CaseCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-terminal-text-dim font-mono">
              <div className="text-lg mb-2">No projects found</div>
              <div className="text-sm">
                No projects match the selected skills: {selectedSkills.join(', ')}
              </div>
              <div className="text-xs mt-2">
                <span className="text-terminal-accent">$</span> Try adjusting your skill filters above
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-terminal-text-dim font-mono text-sm">
          <span className="text-terminal-accent">$</span> ls --help: Browse project portfolio. 
          Filter by selecting skills in the Skills section above.
        </div>
      </div>
    </section>
  )
}