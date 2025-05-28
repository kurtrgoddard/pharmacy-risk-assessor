
import React from 'react';
import { Clock, Users, Shield } from 'lucide-react';
import WaitlistForm from './WaitlistForm';

const FinalCTASection: React.FC = () => {
  return (
    <section id="waitlist" className="py-20 bg-gradient-to-b from-blue-600 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white space-y-6 mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold">
            Ready to Save 28+ Minutes per Assessment?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Join 500+ pharmacists who are already on the waitlist for early access to PharmAssess
          </p>
          
          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Save Time</h3>
              <p className="text-blue-200 text-sm">
                Complete assessments in under 2 minutes instead of 30+
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Stay Compliant</h3>
              <p className="text-blue-200 text-sm">
                Automatic NAPRA compliance checking and updates
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Join Leaders</h3>
              <p className="text-blue-200 text-sm">
                Be among the first to revolutionize risk assessment
              </p>
            </div>
          </div>
        </div>

        {/* Waitlist Form */}
        <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Get Early Access
            </h3>
            <p className="text-gray-600">
              Be the first to know when PharmAssess launches and get exclusive early bird pricing
            </p>
          </div>
          
          <WaitlistForm />
          
          <div className="mt-8 text-center">
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
              <span>✅ No spam, ever</span>
              <span>✅ Unsubscribe anytime</span>
              <span>✅ Canadian data protection</span>
            </div>
          </div>
        </div>

        {/* Urgency */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-full">
            <span className="animate-pulse">🔥</span>
            <span className="font-medium">Limited Early Access Spots Available</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
