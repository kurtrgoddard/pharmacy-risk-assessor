
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Users, 
  Shield, 
  FileText, 
  Target,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { DemoCompound } from '@/data/demoCompounds';

interface OnboardingTourProps {
  onComplete: () => void;
  demoCompounds: DemoCompound[];
}

interface TourStep {
  title: string;
  content: React.ReactNode;
  icon: React.ReactNode;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete, demoCompounds }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps: TourStep[] = [
    {
      title: "Welcome to Risk Assessment",
      icon: <Users className="w-8 h-8 text-pharmacy-blue" />,
      content: (
        <div className="space-y-4">
          <p className="text-pharmacy-gray">
            This pharmaceutical risk assessment tool helps you create NAPRA-compliant safety documentation 
            for compound preparations. Let's explore the key features together.
          </p>
          <div className="bg-pharmacy-lightBlue/10 p-4 rounded-lg">
            <h4 className="font-medium text-pharmacy-darkBlue mb-2">What you'll learn:</h4>
            <ul className="space-y-1 text-sm text-pharmacy-gray">
              <li>• How to assess ingredient risks</li>
              <li>• Understanding NAPRA risk levels</li>
              <li>• Safety equipment requirements</li>
              <li>• Generating compliance reports</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Understanding Risk Levels",
      icon: <Shield className="w-8 h-8 text-pharmacy-blue" />,
      content: (
        <div className="space-y-4">
          <p className="text-pharmacy-gray">
            NAPRA guidelines classify compounding risks into three levels based on ingredient hazards and preparation complexity.
          </p>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <div>
                <Badge className="bg-green-500 text-white mb-1">Level A</Badge>
                <p className="text-sm text-gray-700">Simple preparations, standard PPE, routine procedures</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
              <div>
                <Badge className="bg-yellow-500 text-white mb-1">Level B</Badge>
                <p className="text-sm text-gray-700">Enhanced precautions, specialized equipment, additional training</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <XCircle className="w-6 h-6 text-red-500 mr-3" />
              <div>
                <Badge className="bg-red-500 text-white mb-1">Level C</Badge>
                <p className="text-sm text-gray-700">Hazardous drugs, maximum containment, specialized training required</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ingredient Assessment",
      icon: <Target className="w-8 h-8 text-pharmacy-blue" />,
      content: (
        <div className="space-y-4">
          <p className="text-pharmacy-gray">
            Each ingredient is evaluated against multiple safety databases including NIOSH hazardous drug lists and SDS information.
          </p>
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-medium text-pharmacy-darkBlue mb-3">Assessment Criteria:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-pharmacy-blue rounded-full mr-2"></div>
                <span>NIOSH hazardous drug classification</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-pharmacy-blue rounded-full mr-2"></div>
                <span>Reproductive and developmental toxicity</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-pharmacy-blue rounded-full mr-2"></div>
                <span>WHMIS hazard classifications</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-pharmacy-blue rounded-full mr-2"></div>
                <span>Physical form and handling risks</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Try the Examples",
      icon: <FileText className="w-8 h-8 text-pharmacy-blue" />,
      content: (
        <div className="space-y-4">
          <p className="text-pharmacy-gray">
            Ready to explore? We've prepared three examples showing different risk levels and their safety requirements.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {demoCompounds.map((compound) => (
              <div key={compound.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Badge className={`mr-3 ${
                  compound.riskLevel === 'A' ? 'bg-green-500' :
                  compound.riskLevel === 'B' ? 'bg-yellow-500' : 'bg-red-500'
                } text-white`}>
                  Level {compound.riskLevel}
                </Badge>
                <div>
                  <p className="font-medium text-pharmacy-darkBlue">{compound.name}</p>
                  <p className="text-xs text-pharmacy-gray">{compound.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-pharmacy-lightBlue/10 p-3 rounded-lg">
            <p className="text-sm text-pharmacy-darkBlue">
              💡 <strong>Tip:</strong> Click on any example to see the complete risk assessment with detailed safety requirements and PPE recommendations.
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pharmacy-neutral p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Guided Tour
            </Badge>
            <span className="text-sm text-pharmacy-gray">
              Step {currentStep + 1} of {tourSteps.length}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onComplete}
            className="text-pharmacy-darkBlue"
          >
            <X className="w-4 h-4 mr-2" />
            Skip Tour
          </Button>
        </div>

        <Card className="glass-card">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              {currentTourStep.icon}
            </div>
            <CardTitle className="text-2xl text-pharmacy-darkBlue">
              {currentTourStep.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="mb-8">
              {currentTourStep.content}
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="text-pharmacy-darkBlue"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-2">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      index === currentStep 
                        ? 'bg-pharmacy-blue' 
                        : index < currentStep 
                          ? 'bg-pharmacy-lightBlue' 
                          : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextStep}
                className="bg-pharmacy-blue hover:bg-pharmacy-darkBlue transition-colors duration-200"
              >
                {currentStep === tourSteps.length - 1 ? 'Start Exploring' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingTour;
