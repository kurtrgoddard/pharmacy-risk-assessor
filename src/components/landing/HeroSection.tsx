
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Shield, FileCheck } from 'lucide-react';
import WaitlistForm from './WaitlistForm';
import { trackUserAction } from '@/services/monitoring/analytics';

interface HeroSectionProps {
  onDemoClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onDemoClick }) => {
  const handleWaitlistClick = () => {
    trackUserAction('waitlist_click', 'landing', 'hero');
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>NAPRA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileCheck className="h-4 w-4 text-blue-600" />
              <span>Secure & Validated</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                🇨🇦 Made in Canada
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-tight">
              Stop Spending{' '}
              <span className="text-red-600">30 Minutes</span>{' '}
              on Compound Risk Assessments
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
              NAPRA-compliant pharmaceutical risk assessment in{' '}
              <span className="font-semibold text-blue-600">under 2 minutes</span>
            </p>
          </div>

          {/* Time Savings Callout */}
          <div className="inline-flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
            <Clock className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">Save 28+ minutes per assessment</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              size="lg"
              onClick={handleWaitlistClick}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto"
            >
              Join Waitlist - Get Early Access
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onDemoClick}
              className="border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 h-auto"
            >
              Try Live Demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="pt-8">
            <p className="text-gray-500 text-sm mb-4">Trusted by pharmacists across Canada</p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm">Pharmacists</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">10K+</div>
                <div className="text-sm">Assessments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">94%</div>
                <div className="text-sm">Time Saved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
