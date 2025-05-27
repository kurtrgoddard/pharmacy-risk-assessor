
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, BookOpen, Target, FileText, Info } from 'lucide-react';
import { demoCompounds, DemoCompound } from '@/data/demoCompounds';
import KeswickRiskAssessment from '@/components/KeswickRiskAssessment';
import OnboardingTour from '@/components/OnboardingTour';
import { toast } from 'sonner';

interface DemoModeProps {
  onExitDemo: () => void;
}

const DemoMode: React.FC<DemoModeProps> = ({ onExitDemo }) => {
  const [selectedCompound, setSelectedCompound] = useState<DemoCompound | null>(null);
  const [showTour, setShowTour] = useState(false);

  const getRiskLevelColor = (level: 'A' | 'B' | 'C') => {
    switch (level) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-yellow-500';
      case 'C': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleSelectCompound = (compound: DemoCompound) => {
    setSelectedCompound(compound);
    toast.success(`Loaded demo: ${compound.name}`);
  };

  const handleStartTour = () => {
    setShowTour(true);
  };

  if (showTour) {
    return (
      <OnboardingTour 
        onComplete={() => setShowTour(false)}
        demoCompounds={demoCompounds}
      />
    );
  }

  if (selectedCompound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-pharmacy-neutral">
        <div className="w-full max-w-6xl mx-auto p-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setSelectedCompound(null)}
                className="flex items-center text-pharmacy-darkBlue"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Demo Selection
              </Button>
              <Badge variant="secondary" className="text-sm">
                Demo Mode: {selectedCompound.name}
              </Badge>
            </div>
            <Button
              variant="outline"
              onClick={onExitDemo}
              className="text-pharmacy-darkBlue"
            >
              Exit Demo
            </Button>
          </div>

          <KeswickRiskAssessment
            assessmentData={selectedCompound.assessmentData}
            fileName={`${selectedCompound.name.replace(/\s+/g, '_')}_demo_assessment.pdf`}
            onStartOver={() => setSelectedCompound(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pharmacy-neutral p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={onExitDemo}
              className="flex items-center text-pharmacy-darkBlue"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Main App
            </Button>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Demo Mode
            </Badge>
          </div>
          
          <h1 className="text-3xl font-semibold text-pharmacy-darkBlue mb-4">
            Explore Risk Assessment Examples
          </h1>
          <p className="text-pharmacy-gray max-w-3xl mx-auto mb-6">
            Try our pre-filled examples to understand how different compounds are assessed according to NAPRA guidelines. 
            Each example demonstrates different risk levels and safety requirements.
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={handleStartTour}
              className="bg-pharmacy-blue hover:bg-pharmacy-darkBlue transition-colors duration-200 px-6"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Take Guided Tour
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {demoCompounds.map((compound) => (
            <Card key={compound.id} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg text-pharmacy-darkBlue">
                    {compound.name}
                  </CardTitle>
                  <Badge className={`${getRiskLevelColor(compound.riskLevel)} text-white`}>
                    Level {compound.riskLevel}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {compound.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="text-sm">
                    <span className="font-medium text-pharmacy-darkBlue">Active Ingredient:</span>
                    <p className="text-pharmacy-gray">
                      {compound.assessmentData.activeIngredients[0]?.name || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium text-pharmacy-darkBlue">Key Features:</span>
                    <ul className="text-pharmacy-gray text-xs mt-1 space-y-1">
                      {compound.riskLevel === 'A' && (
                        <>
                          <li>• Simple preparation process</li>
                          <li>• Standard PPE requirements</li>
                          <li>• Minimal safety concerns</li>
                        </>
                      )}
                      {compound.riskLevel === 'B' && (
                        <>
                          <li>• Enhanced safety precautions</li>
                          <li>• Specialized PPE required</li>
                          <li>• Reproductive toxicity concerns</li>
                        </>
                      )}
                      {compound.riskLevel === 'C' && (
                        <>
                          <li>• Hazardous drug classification</li>
                          <li>• Biological safety cabinet required</li>
                          <li>• Maximum containment protocols</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={() => handleSelectCompound(compound)}
                  className="w-full bg-pharmacy-blue hover:bg-pharmacy-darkBlue transition-colors duration-200"
                >
                  <Play className="w-4 h-4 mr-2" />
                  View Assessment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white/50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-pharmacy-darkBlue mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Understanding Risk Levels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Badge className="bg-green-500 text-white mb-2">Level A</Badge>
              <p className="text-sm text-gray-700">
                Simple preparations with minimal risks. Standard operating procedures and basic PPE.
              </p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Badge className="bg-yellow-500 text-white mb-2">Level B</Badge>
              <p className="text-sm text-gray-700">
                Moderate risk compounds requiring enhanced precautions and specialized equipment.
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Badge className="bg-red-500 text-white mb-2">Level C</Badge>
              <p className="text-sm text-gray-700">
                Hazardous drugs requiring maximum containment and specialized training.
              </p>
            </div>
          </div>
        </div>

        <footer className="text-center text-xs text-pharmacy-gray/70">
          <p>Demo assessments based on NAPRA guidelines and USP &lt;795&gt;/&lt;800&gt; standards</p>
        </footer>
      </div>
    </div>
  );
};

export default DemoMode;
