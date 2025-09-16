'use client'

import React, { useState } from 'react'
import { ExternalLink, Github, X } from 'lucide-react'
import { TechChip } from './TechChip'
import { type Project } from '@/data/portfolio'

interface CaseCardProps {
  project: Project
}

export function CaseCard({ project }: CaseCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div 
        className="bg-terminal-bg-light border border-terminal-border rounded-lg p-6 hover:border-terminal-accent transition-all duration-200 cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Project header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-mono font-semibold text-terminal-text group-hover:text-terminal-accent transition-colors">
            {project.title}
          </h3>
          <span className="text-xs font-mono text-terminal-text-dim bg-terminal-border px-2 py-1 rounded">
            {project.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-terminal-text-dim text-sm font-mono mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <TechChip key={tech} name={tech} />
          ))}
          {project.technologies.length > 4 && (
            <span className="text-xs text-terminal-text-dim font-mono px-2 py-1">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 text-sm">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-terminal-accent hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Github size={14} />
              Code
            </a>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-terminal-accent hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} />
              Live
            </a>
          )}
          <button className="text-terminal-text-dim hover:text-terminal-accent transition-colors text-xs font-mono">
            View details →
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setIsModalOpen(false)}>
          <div 
            className="bg-terminal-bg border border-terminal-border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto terminal-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-terminal-border">
              <h2 className="text-xl font-mono font-semibold text-terminal-text">
                {project.title}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-terminal-text-dim hover:text-terminal-accent transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-mono text-terminal-accent mb-2">Description:</h3>
                <p className="text-terminal-text-dim text-sm font-mono leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Features */}
              {project.features && (
                <div>
                  <h3 className="text-sm font-mono text-terminal-accent mb-2">Key Features:</h3>
                  <ul className="space-y-1">
                    {project.features.map((feature, index) => (
                      <li key={index} className="text-terminal-text-dim text-sm font-mono flex items-start gap-2">
                        <span className="text-terminal-accent mt-1 flex-shrink-0">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies */}
              <div>
                <h3 className="text-sm font-mono text-terminal-accent mb-2">Technologies:</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <TechChip key={tech} name={tech} />
                  ))}
                </div>
              </div>

              {/* Architecture diagram placeholder */}
              <div className="bg-terminal-bg-light border border-terminal-border rounded-lg p-4">
                <h3 className="text-sm font-mono text-terminal-accent mb-2">Architecture:</h3>
                <div className="text-terminal-text-dim text-xs font-mono text-center py-8 border border-dashed border-terminal-border rounded">
                  [Architecture Diagram Placeholder]
                  <br />
                  C4/Sequence diagram would go here
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-4">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-terminal-accent text-black font-mono font-semibold rounded-md hover:bg-terminal-accent-dim transition-colors"
                  >
                    <Github size={16} />
                    View Code
                  </a>
                )}
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-terminal-accent text-terminal-accent font-mono font-semibold rounded-md hover:bg-terminal-accent/10 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}