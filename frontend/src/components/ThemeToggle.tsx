'use client'

import React, { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { getTheme, setTheme } from '@/lib/utils'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const theme = getTheme()
    setIsDark(theme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'
    setTheme(newTheme)
    setIsDark(!isDark)
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-2 rounded-md bg-terminal-chrome border border-terminal-border hover:bg-terminal-bg-light transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-terminal-accent" />
      ) : (
        <Moon className="w-5 h-5 text-terminal-accent" />
      )}
    </button>
  )
}