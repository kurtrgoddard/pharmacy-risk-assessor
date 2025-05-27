
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Info, Pill } from 'lucide-react';

const AppHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900">
                Pharmacy Risk Assessor
              </h1>
              <Badge variant="secondary" className="text-xs">
                v0.1.0-beta
              </Badge>
            </div>
          </div>

          {/* About Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Info className="h-4 w-4" />
                <span>About</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Pill className="h-5 w-5 text-blue-600" />
                  <span>About Pharmacy Risk Assessor</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  The Pharmacy Risk Assessor is a professional tool designed to help pharmacists 
                  and compounding facilities conduct comprehensive risk assessments for pharmaceutical 
                  preparations in compliance with NAPRA (National Association of Pharmacy Regulatory Authorities) 
                  guidelines.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Key Features:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>NAPRA-compliant risk assessment workflows</li>
                    <li>Automated safety data integration</li>
                    <li>Professional PDF report generation</li>
                    <li>Ingredient safety analysis</li>
                    <li>Mobile-optimized interface</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Compliance:</h4>
                  <p>
                    This tool is designed to support compliance with NAPRA Model Standards for 
                    Pharmacy Compounding and relevant provincial regulations. Always consult 
                    your local regulatory requirements.
                  </p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    Version 0.1.0-beta | Built with modern web technologies for reliability and performance
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
