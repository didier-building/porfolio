import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/journal', element: <Navigate to="/#journal" replace /> },
  { path: '/ai/job-match', element: <Navigate to="/#job-match" replace /> },
  { path: '/ai/project-bot', element: <Navigate to="/#project-bot" replace /> },
  { path: '/docs', element: <Navigate to="/#docs" replace /> },
  { path: '/profiles', element: <Navigate to="/#profiles" replace /> },
  { path: '/blog', element: <Navigate to="/#journal" replace /> },
  { path: '/blog/:slug', element: <Navigate to="/#journal" replace /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default function Root() {
  return <RouterProvider router={router} />;
}
