# Professional Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. This portfolio is designed for software engineers and developers to showcase their skills, projects, and professional experience.

## Features

- 🌓 Dark/Light theme toggle
- 📱 Fully responsive design
- 🎨 Modern UI with smooth animations
- 📰 Journal, AI Job Match, Project Bot, Docs, and Profiles sections
- ⏱️ Lazy-loaded feature modules
- 🔄 Smooth scroll navigation via hash anchors

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide Icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # React components
├── hooks/          # Reusable hooks (e.g., useInView)
├── App.tsx        # Main single-page application with hash sections
└── main.tsx       # Application entry point
```

## Single-page Sections

Each major feature renders within a `<section id="...">` block in `App.tsx`.
Anchors follow the format `#feature-name` (e.g., `#journal`, `#job-match`).
Feature modules are lazy-loaded and fetch data only when scrolled into view.

## Customization

1. Update API endpoints in `src/services/api.ts`
2. Adjust section IDs and navigation links in `App.tsx` and `Navbar.tsx`
3. Extend lazy-loaded features by following the existing section pattern

## Building for Production

```bash
npm run build
```

## License

MIT
