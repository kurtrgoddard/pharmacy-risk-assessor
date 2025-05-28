
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from '../components/landing/LandingHeader';
import HeroSection from '../components/landing/HeroSection';
import ProblemSolutionSection from '../components/landing/ProblemSolutionSection';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import PricingSection from '../components/landing/PricingSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FinalCTASection from '../components/landing/FinalCTASection';
import LandingFooter from '../components/landing/LandingFooter';
import { trackUserAction } from '../services/monitoring/analytics';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Track landing page view
    trackUserAction('page_view', 'landing', 'home');
    
    // Update document title dynamically
    document.title = 'PharmAssess - Instant NAPRA-Compliant Compound Risk Assessment';
  }, []);

  const handleDemoClick = () => {
    trackUserAction('demo_click', 'landing', 'hero');
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      <LandingHeader onDemoClick={handleDemoClick} />
      <HeroSection onDemoClick={handleDemoClick} />
      <ProblemSolutionSection />
      <FeaturesGrid />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FinalCTASection />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
