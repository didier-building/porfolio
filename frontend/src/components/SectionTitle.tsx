'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SectionTitleProps {
  cmd: string
  className?: string
  id?: string
}

export function SectionTitle({ cmd, className, id }: SectionTitleProps) {
  return (
    <div className={cn("mb-8", className)} id={id}>
      <h2 className="text-2xl md:text-3xl font-mono font-bold">
        <span className="text-terminal-accent">$</span>
        <span className="ml-2 text-terminal-text">{cmd}</span>
        <span className="animate-blink text-terminal-accent ml-1">|</span>
      </h2>
      <div className="mt-2 h-px bg-gradient-to-r from-terminal-accent to-transparent w-24"></div>
    </div>
  )
}