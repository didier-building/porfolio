'use client'

import React, { useState, useEffect } from 'react'

interface TypewriterProps {
  text: string
  delay?: number
  className?: string
  onComplete?: () => void
}

export function Typewriter({ text, delay = 50, className = '', onComplete }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, delay)

      return () => clearTimeout(timer)
    } else if (!isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [currentIndex, text, delay, isComplete, onComplete])

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-blink text-terminal-accent">|</span>
    </span>
  )
}