import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTheme() {
  if (typeof window === 'undefined') return 'dark'
  return localStorage.getItem('theme') || 'dark'
}

export function setTheme(theme: 'light' | 'dark') {
  if (typeof window === 'undefined') return
  localStorage.setItem('theme', theme)
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function initTheme() {
  if (typeof window === 'undefined') return
  const theme = getTheme()
  setTheme(theme as 'light' | 'dark')
}