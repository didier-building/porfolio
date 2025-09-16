'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SectionTitle } from './SectionTitle'
import { TechChip } from './TechChip'
import { portfolioData } from '@/data/portfolio'

export function SkillsSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const { skills } = portfolioData

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof skills>)

  // Initialize selected skills from URL
  useEffect(() => {
    const skillsParam = searchParams.get('skills')
    if (skillsParam) {
      setSelectedSkills(skillsParam.split(',').filter(Boolean))
    }
  }, [searchParams])

  // Update URL when skills selection changes
  const updateSkillsInUrl = (newSelectedSkills: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newSelectedSkills.length > 0) {
      params.set('skills', newSelectedSkills.join(','))
    } else {
      params.delete('skills')
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const toggleSkill = (skillName: string) => {
    const newSelected = selectedSkills.includes(skillName)
      ? selectedSkills.filter(s => s !== skillName)
      : [...selectedSkills, skillName]
    
    setSelectedSkills(newSelected)
    updateSkillsInUrl(newSelected)
  }

  const clearSelection = () => {
    setSelectedSkills([])
    updateSkillsInUrl([])
  }

  return (
    <section id="skills" className="py-16">
      <SectionTitle cmd="skills --list" />
      
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-terminal-text-dim">
          <span>Filter projects by selecting skills:</span>
          {selectedSkills.length > 0 && (
            <button
              onClick={clearSelection}
              className="text-terminal-accent hover:underline"
            >
              Clear filters ({selectedSkills.length})
            </button>
          )}
        </div>

        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-lg font-mono font-semibold text-terminal-accent">
              {category}:
            </h3>
            <div className="flex flex-wrap gap-2">
              {categorySkills
                .sort((a, b) => b.proficiency - a.proficiency)
                .map((skill) => (
                  <TechChip
                    key={skill.id}
                    name={skill.name}
                    proficiency={skill.proficiency}
                    selected={selectedSkills.includes(skill.name)}
                    selectable={true}
                    onClick={() => toggleSkill(skill.name)}
                  />
                ))}
            </div>
          </div>
        ))}

        {selectedSkills.length > 0 && (
          <div className="mt-8 p-4 bg-terminal-bg-light border border-terminal-border rounded-lg">
            <p className="text-terminal-accent font-mono text-sm" aria-live="polite">
              Filtering projects by: {selectedSkills.join(', ')}
            </p>
            <p className="text-terminal-text-dim font-mono text-xs mt-1">
              Scroll to Projects section to see filtered results
            </p>
          </div>
        )}

        <div className="mt-8 text-terminal-text-dim font-mono text-sm">
          <span className="text-terminal-accent">$</span> skills --help: Click any skill to filter projects. 
          Proficiency levels: Expert (90%+), Advanced (75%+), Intermediate (50%+)
        </div>
      </div>
    </section>
  )
}