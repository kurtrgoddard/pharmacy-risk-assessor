
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import NAPRARiskAssessment from './pages/NAPRARiskAssessment';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/napra-assessment" element={<NAPRARiskAssessment />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
