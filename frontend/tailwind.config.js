/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Terminal theme with monochrome + single accent (green)
        terminal: {
          bg: '#0c0c0c',
          'bg-light': '#1a1a1a',
          text: '#e0e0e0',
          'text-dim': '#a0a0a0',
          accent: '#00D26A', // Primary green accent
          'accent-dim': '#00A854',
          border: '#333333',
          chrome: '#2a2a2a',
        },
        // Keep existing colors for compatibility
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'typewriter': 'typewriter 2s steps(40) 1s forwards',
        'blink': 'blink 1s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        typewriter: {
          '0%': { width: '0ch' },
          '100%': { width: '40ch' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}