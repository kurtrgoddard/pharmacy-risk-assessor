import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bug } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pharmacy-blue to-pharmacy-darkBlue">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-xl text-pharmacy-blue">Pharmacy Risk Assessment</span>
          <nav>
            {/* Future navigation links can be added here */}
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Welcome to the Pharmacy Risk Assessment Tool
          </h1>
          <p className="text-lg text-pharmacy-lightGray">
            Assess risks, ensure safety, and maintain compliance in your pharmacy practice.
          </p>
        </section>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-pharmacy-lightBlue">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.914 0-5.683-.342-8.062-.9a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                </div>
                <CardTitle className="text-xl">NAPRA Risk Assessment</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Assess the risks associated with non-sterile compounding according to NAPRA guidelines.
              </p>
              <Button 
                onClick={() => navigate('/napra-assessment')} 
                variant="outline" 
                className="w-full"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-pharmacy-lightBlue">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-600">
                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM15.75 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472.655-5.657.962-8.992 1.026a.75.75 0 01-.431-.674l-.011-.168v-.002zM22.5 19.125a7.125 7.125 0 01-14.25 0v.003l.001.119a.75.75 0 01.363.63 13.067 13.067 0 016.761 1.873c2.472.655 5.657.962 8.992 1.026a.75.75 0 01.431-.674l.011-.168v-.002z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Secure Assessment</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                A more secure version of the NAPRA risk assessment tool.
              </p>
              <Button
                onClick={() => navigate('/secure-napra-assessment')}
                variant="outline"
                className="w-full"
              >
                Access Secure Assessment
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-pharmacy-lightBlue">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Bug className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">System Testing</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Test API integrations, verify cache functionality, and check system reliability
              </p>
              <Button 
                onClick={() => navigate('/test')} 
                variant="outline" 
                className="w-full"
              >
                Access Test Mode
              </Button>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-16 text-center">
          <p className="text-pharmacy-lightGray">
            &copy; {new Date().getFullYear()} Pharmacy Risk Assessment Tool. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
