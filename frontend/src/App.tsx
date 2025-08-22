import { lazy, Suspense, useEffect } from 'react';
import Navbar from './components/Navbar';

const Journal = lazy(() => import('./components/Journal'));
const JobMatch = lazy(() => import('./components/JobMatch'));
const ProjectBot = lazy(() => import('./components/ProjectBot'));
const Comms = lazy(() => import('./components/Comms'));
const Profiles = lazy(() => import('./components/Profiles'));

function App() {
  useEffect(() => {
    const legacyMap: Record<string, string> = {
      '/journal': '#journal',
      '/ai/job-match': '#job-match',
      '/ai/project-bot': '#project-bot',
      '/docs': '#docs',
      '/profiles': '#profiles',
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

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar />
      <main>
        <section id="journal">
          <Suspense fallback={<div>Loading...</div>}>
            <Journal />
          </Suspense>
        </section>
        <section id="job-match">
          <Suspense fallback={<div>Loading...</div>}>
            <JobMatch />
          </Suspense>
        </section>
        <section id="project-bot">
          <Suspense fallback={<div>Loading...</div>}>
            <ProjectBot />
          </Suspense>
        </section>
        <section id="docs">
          <Suspense fallback={<div>Loading...</div>}>
            <Comms />
          </Suspense>
        </section>
        <section id="profiles">
          <Suspense fallback={<div>Loading...</div>}>
            <Profiles />
          </Suspense>
        </section>
      </main>
    </div>
  );
}

export default App;
