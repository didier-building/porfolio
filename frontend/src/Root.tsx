import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Comms from './components/Comms';
import Profiles from './components/Profiles';
import JobMatch from './components/JobMatch';
import ProjectBot from './components/ProjectBot';
import Journal from './components/Journal';
import ComingSoon from './components/ComingSoon';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'blog', element: <ComingSoon /> },
      { path: 'blog/:slug', element: <ComingSoon /> },
      { path: 'docs', element: <Comms /> },
      { path: 'profiles', element: <Profiles /> },
      { path: 'journal', element: <Journal /> },
      { path: 'ai/job-match', element: <JobMatch /> },
      { path: 'ai/project-bot', element: <ProjectBot /> },
    ],
  },
]);

export default function Root() {
  return <RouterProvider router={router} />;
}
