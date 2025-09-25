'use client'

import React from 'react'
import { Code, Briefcase, User, Mail, Zap, Database } from 'lucide-react'

interface QuickAction {
  id: string
  icon: React.ReactNode
  label: string
  message: string
  color: string
}

interface AISecretaryQuickActionsProps {
  onQuickAction: (message: string) => void
  className?: string
}

const quickActions: QuickAction[] = [
  {
    id: 'projects',
    icon: <Code size={16} />,
    label: 'Projects',
    message: 'Tell me about Didier\'s most impressive projects',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  },
  {
    id: 'skills',
    icon: <Database size={16} />,
    label: 'Skills',
    message: 'What are Didier\'s core technical skills?',
    color: 'bg-green-500/20 text-green-400 border-green-500/30'
  },
  {
    id: 'experience',
    icon: <Briefcase size={16} />,
    label: 'Experience',
    message: 'Tell me about Didier\'s professional experience',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  },
  {
    id: 'services',
    icon: <Zap size={16} />,
    label: 'Services',
    message: 'What services does Didier offer?',
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  },
  {
    id: 'availability',
    icon: <User size={16} />,
    label: 'Availability',
    message: 'Is Didier available for new projects?',
    color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  },
  {
    id: 'contact',
    icon: <Mail size={16} />,
    label: 'Contact',
    message: 'How can I get in touch with Didier?',
    color: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
  }
]

export function AISecretaryQuickActions({ onQuickAction, className = '' }: AISecretaryQuickActionsProps) {
  return (
    <div className={`p-2 border-t border-terminal-border dark:border-terminal-border bg-terminal-bg-light/50 dark:bg-terminal-bg-light/50 ${className}`}>
      <div className="mb-1">
        <h4 className="text-xs font-mono text-terminal-text-dim dark:text-terminal-text-dim uppercase tracking-wide">
          Quick Questions
        </h4>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onQuickAction(action.message)}
            className={`flex items-center gap-1 p-1.5 rounded-md border transition-all duration-200 hover:scale-105 font-mono text-xs ${action.color} dark:${action.color}`}
          >
            {action.icon}
            <span className="truncate">{action.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-1 text-xs text-terminal-text-dim dark:text-terminal-text-dim font-mono text-center">
        Click to start
      </div>
    </div>
  )
}