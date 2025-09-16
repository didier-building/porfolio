'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface TerminalFrameProps {
  children: React.ReactNode
  className?: string
}

export function TerminalFrame({ children, className }: TerminalFrameProps) {
  return (
    <div className={cn(
      "min-h-screen bg-terminal-bg text-terminal-text font-mono",
      "dark:bg-terminal-bg dark:text-terminal-text",
      "light:bg-white light:text-gray-900",
      className
    )}>
      {/* Terminal Window Chrome */}
      <div className="sticky top-0 z-50 bg-terminal-chrome border-b border-terminal-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="ml-4 text-terminal-text-dim text-sm">
              didier@portfolio:~$
            </span>
          </div>
          <div className="text-terminal-text-dim text-xs">
            Terminal Portfolio v1.0
          </div>
        </div>
      </div>
      
      {/* Terminal Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </div>
    </div>
  )
}