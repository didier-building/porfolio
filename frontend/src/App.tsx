import { lazy, Suspense, useEffect } from 'react';
import { Navbar, Hero, About, Footer, ErrorBoundary } from './components';
import RecruiterLanding from './pages/RecruiterLanding';

const Projects = lazy(() => import('./components').then((m) => ({ default: m.Projects })));
const Skills = lazy(() => import('./components').then((m) => ({ default: m.Skills })));
const Experience = lazy(() => import('./components').then((m) => ({ default: m.Experience })));
const Contact = lazy(() => import('./components').then((m) => ({ default: m.Contact })));
const Journal = lazy(() => import('./components').then((m) => ({ default: m.Journal })));
const JobMatch = lazy(() => import('./components').then((m) => ({ default: m.JobMatch })));
const ProjectBot = lazy(() => import('./components').then((m) => ({ default: m.ProjectBot })));

function App() {
  // Check if this is the recruiter microsite
  const isRecruiterSite = window.location.pathname === '/recruiter' ||
                          window.location.search.includes('recruiter=true');

  useEffect(() => {
    const legacyMap: Record<string, string> = {
      '/about': '#about',
      '/projects': '#projects',
      '/skills': '#skills',
      '/experience': '#experience',
      '/contact': '#contact',
      '/journal': '#journal',
      '/ai/job-match': '#job-match',
      '/ai/project-bot': '#project-bot',
    };

    const navigateToHash = (hash: string) => {
      const element = document.querySelector(hash);
      if (element) {
        window.history.replaceState(null, '', `/${hash}`);
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.pageYOffset - 80,
          behavior: 'smooth',
        });
      }
    };

    const initialHash = legacyMap[window.location.pathname] || window.location.hash;
    if (initialHash) {
      navigateToHash(initialHash);
    }

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'A') return;
      const href = target.getAttribute('href');
      if (!href) return;
      const hash = href.startsWith('#') ? href : legacyMap[href];
      if (hash) {
        e.preventDefault();
        navigateToHash(hash);
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  // Return recruiter microsite if accessed via recruiter route
  if (isRecruiterSite) {
    return (
      <ErrorBoundary>
        <RecruiterLanding />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
        <Navbar />
        <main>
        <Hero />
        
        <section id="skills">
          <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>}>
            <Skills />
          </Suspense>
        </section>
        
        <section id="experience">
          <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>}>
            <Experience />
          </Suspense>
        </section>
        
        <section id="projects">
          <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>}>
            <Projects />
          </Suspense>
        </section>
        
        <section id="about">
          <About />
        </section>
        
        <section id="contact">
          <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>}>
            <Contact />
          </Suspense>
        </section>
        
        {/* AI Tools Section */}
        <section id="journal" className="border-t border-slate-200 dark:border-slate-800">
          <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>}>
            <Journal />
          </Suspense>
        </section>
        
        <section id="job-match">
          <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>}>
            <JobMatch />
          </Suspense>
        </section>
        
        <section id="project-bot">
          <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>}>
            <ProjectBot />
          </Suspense>
        </section>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
