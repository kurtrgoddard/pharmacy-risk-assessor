
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
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
  }, []);

  const handleDemoClick = () => {
    trackUserAction('demo_click', 'landing', 'hero');
    navigate('/app');
  };

  return (
    <>
      <Helmet>
        <title>PharmAssess - Instant NAPRA-Compliant Compound Risk Assessment</title>
        <meta name="description" content="Save 90% time on pharmaceutical compound risk assessments. NAPRA-compliant reports in under 2 minutes. Join 500+ pharmacists reducing assessment time from 30 minutes to 2 minutes." />
        <meta name="keywords" content="NAPRA compliance, pharmaceutical risk assessment, compound risk, pharmacy software, drug safety, pharmaceutical compounding" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="PharmAssess - Instant NAPRA-Compliant Risk Assessment" />
        <meta property="og:description" content="Save 90% time on pharmaceutical compound risk assessments. NAPRA-compliant reports in under 2 minutes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pharmacy-risk-assessor.lovable.app/" />
        <meta property="og:image" content="https://pharmacy-risk-assessor.lovable.app/og-image.jpg" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PharmAssess - Instant NAPRA-Compliant Risk Assessment" />
        <meta name="twitter:description" content="Save 90% time on pharmaceutical compound risk assessments." />
        <meta name="twitter:image" content="https://pharmacy-risk-assessor.lovable.app/og-image.jpg" />
        
        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "PharmAssess",
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web",
            "description": "NAPRA-compliant pharmaceutical risk assessment software",
            "offers": {
              "@type": "Offer",
              "priceCurrency": "CAD",
              "price": "99"
            }
          })}
        </script>
      </Helmet>

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
    </>
  );
};

export default LandingPage;
