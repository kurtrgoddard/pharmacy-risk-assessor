
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, CheckCircle, Clock, FileText } from "lucide-react";
import { toast } from "sonner";

const Demo = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const demoScenarios = [
    {
      title: "Ketoprofen 10% PLO Gel",
      description: "Common pain management compound",
      complexity: "Level A",
      estimatedTime: "< 2 minutes",
      ingredients: ["Ketoprofen 10%", "PLO Gel Base"],
      riskFactors: ["NSAID - skin irritation potential", "Semi-solid preparation"]
    },
    {
      title: "Morphine 20mg/mL Oral Solution",
      description: "Controlled substance preparation",
      complexity: "Level C",
      estimatedTime: "< 2 minutes",
      ingredients: ["Morphine Sulfate 20mg/mL", "Simple Syrup"],
      riskFactors: ["NIOSH Table 1 - High hazard", "Narcotic handling", "Reproductive toxicity"]
    },
    {
      title: "Tretinoin 0.1% Cream",
      description: "Dermatological compound",
      complexity: "Level B",
      estimatedTime: "< 2 minutes",
      ingredients: ["Tretinoin 0.1%", "Cream Base"],
      riskFactors: ["Teratogenic potential", "Light-sensitive", "Powder handling"]
    }
  ];

  const demoSteps = [
    {
      title: "Select Compound",
      description: "Choose from common pharmacy preparations",
      duration: 10
    },
    {
      title: "Ingredient Analysis",
      description: "AI analyzes hazard data from multiple sources",
      duration: 15
    },
    {
      title: "Risk Assessment",
      description: "NAPRA Level A/B/C assignment with rationale",
      duration: 20
    },
    {
      title: "PPE & Controls",
      description: "Recommended safety measures and engineering controls",
      duration: 15
    },
    {
      title: "Generate Report",
      description: "Professional PDF ready for regulatory review",
      duration: 10
    }
  ];

  const runDemo = async (scenarioIndex: number) => {
    setIsRunning(true);
    setCurrentStep(0);
    
    const scenario = demoScenarios[scenarioIndex];
    toast.success(`Starting demo: ${scenario.title}`);

    for (let i = 0; i < demoSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, demoSteps[i].duration * 100));
      setCurrentStep(i + 1);
      toast.success(`✓ ${demoSteps[i].title} completed`);
    }

    setIsRunning(false);
    toast.success("🎉 Risk assessment completed in under 2 minutes!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">PharmAssess Demo</h1>
              <Badge className="bg-green-100 text-green-800">Interactive Preview</Badge>
            </div>
            <Button onClick={() => navigate('/waitlist')}>
              Get Full Access
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Demo Introduction */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            See PharmAssess in Action
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Experience how Canadian pharmacists complete NAPRA-compliant risk assessments in under 2 minutes
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-600" />
              <span>2-minute assessments</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              <span>NAPRA compliant</span>
            </div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-purple-600" />
              <span>Professional reports</span>
            </div>
          </div>
        </div>

        {/* Demo Scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {demoScenarios.map((scenario, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{scenario.title}</CardTitle>
                  <Badge 
                    variant={scenario.complexity === 'Level C' ? 'destructive' : 
                            scenario.complexity === 'Level B' ? 'default' : 'secondary'}
                  >
                    {scenario.complexity}
                  </Badge>
                </div>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Ingredients:</span>
                    <ul className="text-sm text-gray-600 mt-1">
                      {scenario.ingredients.map((ingredient, i) => (
                        <li key={i}>• {ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Key Risk Factors:</span>
                    <ul className="text-sm text-gray-600 mt-1">
                      {scenario.riskFactors.map((risk, i) => (
                        <li key={i}>• {risk}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2">
                    <Button 
                      className="w-full" 
                      onClick={() => runDemo(index)}
                      disabled={isRunning}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {isRunning ? 'Running Demo...' : 'Run Demo'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Progress */}
        {isRunning && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Demo in Progress</CardTitle>
              <CardDescription>
                Watch as PharmAssess completes a full risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index < currentStep ? 'bg-green-500 text-white' :
                      index === currentStep ? 'bg-blue-500 text-white animate-pulse' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-sm">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm text-gray-600">{step.description}</div>
                    </div>
                    {index === currentStep && (
                      <div className="text-sm text-blue-600 animate-pulse">
                        Processing...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demo Results */}
        {!isRunning && currentStep > 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Demo Completed! 🎉</CardTitle>
              <CardDescription className="text-green-700">
                Risk assessment completed in under 2 minutes with full NAPRA compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <div className="text-sm">NAPRA Compliant</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">&lt; 2min</div>
                  <div className="text-sm">Assessment Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">PDF</div>
                  <div className="text-sm">Report Generated</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button onClick={() => navigate('/waitlist')} className="bg-green-600 hover:bg-green-700">
                  Get Full Access - Join Waitlist
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feature Comparison */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Traditional vs PharmAssess</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700">Traditional Method</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center text-red-600">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    30-45 minutes per assessment
                  </li>
                  <li className="flex items-center text-red-600">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Manual database searches
                  </li>
                  <li className="flex items-center text-red-600">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Risk of compliance errors
                  </li>
                  <li className="flex items-center text-red-600">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Inconsistent documentation
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">PharmAssess</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-3" />
                    Under 2 minutes per assessment
                  </li>
                  <li className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-3" />
                    Automated real-time data lookup
                  </li>
                  <li className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-3" />
                    Built-in NAPRA compliance
                  </li>
                  <li className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-3" />
                    Professional standardized reports
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Workflow?</h3>
          <p className="text-gray-600 mb-6">
            Join 500+ Canadian pharmacists already on our waitlist
          </p>
          <Button size="lg" onClick={() => navigate('/waitlist')}>
            Join Waitlist - Get 50% Early Bird Discount
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Demo;
