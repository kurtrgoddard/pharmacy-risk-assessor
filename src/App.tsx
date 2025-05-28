
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NAPRARiskAssessment from './pages/NAPRARiskAssessment';
import SecureNAPRARiskAssessmentPage from './pages/SecureNAPRARiskAssessment';
import Dashboard from './pages/Dashboard';
import Index from './pages/Index';
import SharedAssessment from './pages/SharedAssessment';
import TestMode from './pages/TestMode';
import LandingPage from './pages/LandingPage';
import AdminWaitlist from './pages/AdminWaitlist';
import CookieNotice from './components/CookieNotice';
import { SkipLinks, KeyboardShortcuts } from './components/KeyboardNavigation';
import { config } from './config/environment';
import { logger } from './utils/logger';

function App() {
  useEffect(() => {
    // Log application start
    logger.info('Application started', {
      environment: config.environment,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }, 'App');

    // Set up error boundary for unhandled errors
    const handleError = (event: ErrorEvent) => {
      logger.error('Unhandled error', event.error, 'App');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error('Unhandled promise rejection', event.reason, 'App');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <Router>
      <SkipLinks />
      <KeyboardShortcuts />
      <main id="main-content" className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Index />} />
          <Route path="/app/napra-assessment" element={<NAPRARiskAssessment />} />
          <Route path="/app/secure-napra-assessment" element={<SecureNAPRARiskAssessmentPage />} />
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route path="/app/shared-assessment/:shareId" element={<SharedAssessment />} />
          <Route path="/app/test" element={<TestMode />} />
          <Route path="/test" element={<Navigate to="/app/test" replace />} />
          <Route path="/admin/waitlist" element={<AdminWaitlist />} />
          {/* Health check route - only available in non-production */}
          {!config.environment === false && (
            <Route path="/api/health" element={<HealthCheckEndpoint />} />
          )}
        </Routes>
      </main>
      <CookieNotice />
    </Router>
  );
}

// Simple health check component for the route
const HealthCheckEndpoint: React.FC = () => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.environment,
    version: '1.0.0'
  };

  return (
    <div className="p-8">
      <h1>Health Check</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(healthData, null, 2)}
      </pre>
    </div>
  );
};

export default App;
