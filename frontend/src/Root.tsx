import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Comms from './components/Comms';
import Profiles from './components/Profiles';
import JobMatch from './components/JobMatch';
import ProjectBot from './components/ProjectBot';
import Journal from './components/Journal';
import ComingSoon from './components/ComingSoon';

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
          <Route path="/blog" element={<ComingSoon />} />
          <Route path="/blog/:slug" element={<ComingSoon />} />
          <Route path="/docs" element={<Comms />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/ai/job-match" element={<JobMatch />} />
          <Route path="/ai/project-bot" element={<ProjectBot />} />
      </Routes>
    </BrowserRouter>
  );
}
