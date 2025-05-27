
import React from 'react';
import { Button } from '@/components/ui/button';

const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Pharmacy Risk Assessor
            </h3>
            <p className="text-sm text-gray-600">
              Professional pharmaceutical risk assessment tool for NAPRA compliance.
            </p>
            <p className="text-xs text-gray-500">
              © {currentYear} Pharmacy Risk Assessor. All rights reserved.
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Legal
            </h3>
            <div className="space-y-2">
              <Button 
                variant="link" 
                className="h-auto p-0 text-sm text-gray-600 justify-start"
                onClick={() => console.log('Privacy Policy clicked')}
              >
                Privacy Policy
              </Button>
              <Button 
                variant="link" 
                className="h-auto p-0 text-sm text-gray-600 justify-start"
                onClick={() => console.log('Terms of Service clicked')}
              >
                Terms of Service
              </Button>
              <Button 
                variant="link" 
                className="h-auto p-0 text-sm text-gray-600 justify-start"
                onClick={() => console.log('Compliance clicked')}
              >
                NAPRA Compliance
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Support
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Email: support@pharmacyrisk.com</p>
              <p>Phone: 1-800-PHARMACY</p>
              <p>Hours: Mon-Fri 9AM-5PM EST</p>
            </div>
            <div className="pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => console.log('Contact support clicked')}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-xs text-gray-500">
              This software is intended for professional use by licensed pharmacists and compounding facilities.
            </p>
            <p className="text-xs text-gray-500">
              Version 0.1.0-beta
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
