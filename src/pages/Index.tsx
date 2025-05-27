import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { Sparkles } from "lucide-react";
import AppHeader from '@/components/ui/AppHeader';
import AppFooter from '@/components/ui/AppFooter';

const Index = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleApiKeySubmit = () => {
    if (apiKey.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please enter an API key.',
        duration: 3000,
      });
      return;
    }

    localStorage.setItem('apiKey', apiKey);
    toast({
      title: 'Success',
      description: 'API key saved successfully!',
      duration: 2000,
    });
  };

  const handleStartAssessment = () => {
    // Check if API key exists
    const storedApiKey = localStorage.getItem('apiKey');
    if (!storedApiKey) {
      toast({
        title: 'Error',
        description: 'Please enter and save your API key first.',
        duration: 3000,
      });
      return;
    }

    navigate('/napra-assessment');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <AppHeader />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Pharmaceutical Risk Assessment
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Professional NAPRA-compliant risk assessment tool for pharmaceutical compounding. 
              Streamline your safety evaluations with automated data integration and comprehensive reporting.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>NAPRA Compliance</CardTitle>
                <CardDescription>Ensure adherence to regulatory standards.</CardDescription>
              </CardHeader>
              <CardContent>
                Our tool is designed to meet NAPRA guidelines for pharmaceutical compounding risk assessments.
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Automated Data</CardTitle>
                <CardDescription>Integrate safety data seamlessly.</CardDescription>
              </CardHeader>
              <CardContent>
                Automated data integration streamlines the risk assessment process, saving time and improving accuracy.
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Comprehensive Reporting</CardTitle>
                <CardDescription>Generate detailed PDF reports.</CardDescription>
              </CardHeader>
              <CardContent>
                Create professional PDF reports that document your risk assessment findings and compliance efforts.
              </CardContent>
            </Card>
          </div>

          {/* API Key Input Section */}
          <div className="max-w-md mx-auto mb-8">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Enter Your API Key</CardTitle>
                <CardDescription>
                  An API key is required to access all features.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    placeholder="sk-..."
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleApiKeySubmit}>
                  Save API Key
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Demo & Call to Action Section */}
          <div className="text-center">
            <Button size="lg" className="bg-pharmacy-blue text-white hover:bg-pharmacy-darkBlue" onClick={handleStartAssessment}>
              <Sparkles className="mr-2 h-5 w-5" />
              Start Assessment
            </Button>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
};

export default Index;
