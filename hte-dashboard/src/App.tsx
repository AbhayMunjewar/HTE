import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardProvider } from './contexts/DashboardContext';
import { Dashboard } from './pages/Dashboard';
import { Colleges } from './pages/Colleges';
import { Prediction } from './pages/Prediction';
import { AiAssistant } from './pages/AiAssistant';
import { GovernmentLandingPage } from './pages/GovernmentLandingPage';

import { Students } from './pages/Students';
import { Faculty } from './pages/Faculty';
import { Placements } from './pages/Placements';

// Mock empty pages for now
const Reports = () => <div className="p-8 text-center text-slate-500">Reports Module Coming Soon</div>;
const Settings = () => <div className="p-8 text-center text-slate-500">Settings Module Coming Soon</div>;

/**
 * AppRoutes renders the landing page standalone (no sidebar/topbar),
 * while all dashboard routes are wrapped in the existing Layout.
 */
const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return <GovernmentLandingPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/colleges" element={<Colleges />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/placements" element={<Placements />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/ai-assistant" element={<AiAssistant />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <DashboardProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DashboardProvider>
  );
}

export default App;
