
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { useNotifications } from '@/hooks/useNotifications';
import { monitorNetworkConnectivity } from '@/utils/errorHandling';
import ErrorBoundary from '@/components/ErrorBoundary';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import NAPRARiskAssessment from './pages/NAPRARiskAssessment';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const { showConnectionStatus } = useNotifications();

  useEffect(() => {
    // Monitor network connectivity
    const cleanup = monitorNetworkConnectivity((isOnline) => {
      showConnectionStatus(isOnline);
    });

    return cleanup;
  }, [showConnectionStatus]);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/napra-assessment" element={<NAPRARiskAssessment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster 
        position="bottom-right" 
        expand={true}
        richColors={true}
        closeButton={true}
      />
    </ErrorBoundary>
  );
}

export default App;
