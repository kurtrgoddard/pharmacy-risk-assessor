
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NAPRARiskAssessment from './pages/NAPRARiskAssessment';
import SecureNAPRARiskAssessmentPage from './pages/SecureNAPRARiskAssessment';
import Dashboard from './pages/Dashboard';
import Index from './pages/Index';
import SharedAssessment from './pages/SharedAssessment';
import TestMode from './pages/TestMode';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/napra-assessment" element={<NAPRARiskAssessment />} />
        <Route path="/secure-napra-assessment" element={<SecureNAPRARiskAssessmentPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/shared-assessment/:shareId" element={<SharedAssessment />} />
        <Route path="/test" element={<TestMode />} />
      </Routes>
    </Router>
  );
}

export default App;
