'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface TechChipProps {
  name: string
  selected?: boolean
  selectable?: boolean
  onClick?: () => void
  proficiency?: number
  className?: string
}

export function TechChip({ 
  name, 
  selected = false, 
  selectable = false, 
  onClick, 
  proficiency,
  className 
}: TechChipProps) {
  const getProficiencyColor = (level?: number) => {
    if (!level) return 'border-terminal-border bg-terminal-bg-light'
    if (level >= 90) return 'border-terminal-accent bg-terminal-accent/10'
    if (level >= 75) return 'border-blue-500 bg-blue-500/10'
    if (level >= 50) return 'border-yellow-500 bg-yellow-500/10'
    return 'border-gray-500 bg-gray-500/10'
  }

  const getProficiencyLevel = (level?: number) => {
    if (!level) return ''
    if (level >= 90) return 'Expert'
    if (level >= 75) return 'Advanced'
    if (level >= 50) return 'Intermediate'
    return 'Beginner'
  }

  return (
    <button
      onClick={selectable ? onClick : undefined}
      disabled={!selectable}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border transition-all duration-200",
        "font-mono",
        selected 
          ? "border-terminal-accent bg-terminal-accent/20 text-terminal-accent" 
          : getProficiencyColor(proficiency),
        selectable && "hover:border-terminal-accent hover:bg-terminal-accent/10 cursor-pointer",
        !selectable && "cursor-default",
        "focus:outline-none focus:ring-2 focus:ring-terminal-accent/50",
        className
      )}
      title={proficiency ? `${name} - ${getProficiencyLevel(proficiency)} (${proficiency}%)` : name}
    >
      <span className="text-terminal-text">{name}</span>

    </button>
  )
}