import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NAPRARiskAssessment from './pages/NAPRARiskAssessment';
import SecureNAPRARiskAssessmentPage from './pages/SecureNAPRARiskAssessment';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import SharedAssessment from './pages/SharedAssessment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/napra-assessment" element={<NAPRARiskAssessment />} />
        <Route path="/secure-napra-assessment" element={<SecureNAPRARiskAssessmentPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/shared-assessment/:shareId" element={<SharedAssessment />} />
      </Routes>
    </Router>
  );
}

export default App;
