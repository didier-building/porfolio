import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Didier Imanirahari - Terminal Portfolio',
  description: 'Backend/Full-Stack Engineer specializing in Python, Django, React, and Web3 solutions. Building intelligent software with modern technologies.',
  keywords: ['Didier Imanirahari', 'Full-Stack Engineer', 'Backend Developer', 'Python', 'Django', 'React', 'TypeScript', 'Web3', 'Blockchain'],
  authors: [{ name: 'Didier Imanirahari' }],
  creator: 'Didier Imanirahari',
  openGraph: {
    title: 'Didier Imanirahari - Terminal Portfolio',
    description: 'Backend/Full-Stack Engineer specializing in intelligent software and Web3 solutions',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Didier Imanirahari - Terminal Portfolio',
    description: 'Backend/Full-Stack Engineer specializing in intelligent software and Web3 solutions',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'dark';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })()
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}