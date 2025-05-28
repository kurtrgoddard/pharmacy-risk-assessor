
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, FileText, Plus } from "lucide-react";
import { toast } from "sonner";
import DocumentUploadSystem from '@/components/DocumentUploadSystem';
import KeswickDataReview from '@/components/KeswickDataReview';
import KeswickRiskAssessmentReport from '@/components/KeswickRiskAssessmentReport';
import ProvinceSelector from '@/components/ProvinceSelector';
import APIStatusDashboard from '@/components/APIStatusDashboard';
import { KeswickAssessmentData } from '@/components/KeswickRiskAssessment';

// Test credentials and data for demo purposes
const TEST_CREDENTIALS = {
  pharmacyName: "Maple Leaf Pharmacy",
  licenseNumber: "ON-12345",
  pharmacistName: "Dr. Sarah Johnson, PharmD",
  address: "123 Main Street, Toronto, ON M5V 3A8"
};

const SAMPLE_FORMULAS = [
  {
    name: "Ketoprofen 10% PLO Gel",
    ingredients: ["Ketoprofen", "PLO Gel Base", "Methylparaben"],
    riskLevel: "Level B",
    description: "Common topical anti-inflammatory compound"
  },
  {
    name: "Gabapentin 6% Cream",
    ingredients: ["Gabapentin", "Lipoderm Base"],
    riskLevel: "Level A", 
    description: "Neuropathic pain topical preparation"
  },
  {
    name: "Ketamine 10% Cream",
    ingredients: ["Ketamine HCl", "PLO Gel Base"],
    riskLevel: "Level C",
    description: "High-risk controlled substance topical"
  }
];

type AssessmentStep = 'upload' | 'review' | 'report';

const NAPRARiskAssessment = () => {
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('upload');
  const [selectedProvince, setSelectedProvince] = useState<string>('ON');
  const [extractedData, setExtractedData] = useState<KeswickAssessmentData | null>(null);
  const [finalAssessment, setFinalAssessment] = useState<KeswickAssessmentData | null>(null);

  const handleBack = () => {
    window.history.back();
  };

  const handleDocumentProcessed = (document: any) => {
    // Mock extracted data based on uploaded document
    const mockData: KeswickAssessmentData = {
      compoundName: "Ketoprofen 10% in PLO Gel",
      din: "N/A (Compounded)",
      activeIngredients: [
        {
          name: "Ketoprofen",
          manufacturer: "PCCA",
          nioshStatus: {
            isOnNioshList: false,
            hazardLevel: "Non-Hazardous",
            hazardType: []
          },
          reproductiveToxicity: false,
          whmisHazards: true,
          sdsDescription: "May cause eye and skin irritation. Avoid inhalation.",
          monographWarnings: "Contraindicated in patients with NSAID hypersensitivity."
        }
      ],
      preparationDetails: {
        frequency: "Weekly",
        quantity: "100g per batch",
        concentrationRisk: false
      },
      physicalCharacteristics: ["Semi-Solid", "Cream/Ointment"],
      equipmentRequired: ["Balance", "Ointment Mill"],
      safetyChecks: {
        specialEducation: {
          required: false,
          description: ""
        },
        verificationRequired: true,
        equipmentAvailable: true,
        ventilationRequired: false
      },
      workflowConsiderations: {
        uninterruptedWorkflow: {
          status: true,
          measures: ""
        },
        microbialContaminationRisk: false,
        crossContaminationRisk: false
      },
      exposureRisks: ["Skin", "Eye"],
      ppe: {
        gloves: "Nitrile gloves",
        gown: "Lab coat",
        mask: "Standard surgical mask",
        eyeProtection: true,
        otherPPE: []
      },
      safetyEquipment: {
        eyeWashStation: true,
        safetyShower: false
      },
      riskLevel: "Level B",
      rationale: "Moderate complexity due to semi-solid formulation and potential for skin/eye irritation. Requires standard compounding precautions."
    };
    
    setExtractedData(mockData);
    setCurrentStep('review');
    toast.success("Document processed - ingredients extracted successfully");
  };

  const handleUseSampleFormula = (formula: typeof SAMPLE_FORMULAS[0]) => {
    const mockData: KeswickAssessmentData = {
      compoundName: formula.name,
      din: "N/A (Compounded)",
      activeIngredients: formula.ingredients.map(ingredient => ({
        name: ingredient,
        manufacturer: "PCCA",
        nioshStatus: {
          isOnNioshList: ingredient === "Ketamine HCl",
          hazardLevel: ingredient === "Ketamine HCl" ? "High Hazard" : "Non-Hazardous",
          hazardType: ingredient === "Ketamine HCl" ? ["Controlled Substance"] : []
        },
        reproductiveToxicity: false,
        whmisHazards: ingredient !== "PLO Gel Base",
        sdsDescription: `Safety data for ${ingredient}`,
        monographWarnings: `Standard warnings for ${ingredient}`
      })),
      preparationDetails: {
        frequency: "As needed",
        quantity: "30g per preparation",
        concentrationRisk: formula.riskLevel === "Level C"
      },
      physicalCharacteristics: ["Semi-Solid", "Cream/Ointment"],
      equipmentRequired: ["Balance", "Ointment Mill"],
      safetyChecks: {
        specialEducation: {
          required: formula.riskLevel === "Level C",
          description: formula.riskLevel === "Level C" ? "Controlled substance handling training required" : ""
        },
        verificationRequired: true,
        equipmentAvailable: true,
        ventilationRequired: formula.riskLevel === "Level C"
      },
      workflowConsiderations: {
        uninterruptedWorkflow: {
          status: true,
          measures: ""
        },
        microbialContaminationRisk: false,
        crossContaminationRisk: formula.riskLevel !== "Level A"
      },
      exposureRisks: ["Skin", "Eye"],
      ppe: {
        gloves: formula.riskLevel === "Level C" ? "Double nitrile gloves" : "Nitrile gloves",
        gown: formula.riskLevel === "Level C" ? "Disposable gown" : "Lab coat",
        mask: formula.riskLevel === "Level C" ? "N95 respirator" : "Standard surgical mask",
        eyeProtection: true,
        otherPPE: []
      },
      safetyEquipment: {
        eyeWashStation: true,
        safetyShower: formula.riskLevel === "Level C"
      },
      riskLevel: formula.riskLevel as any,
      rationale: `Assessment based on ${formula.description.toLowerCase()}. ${formula.riskLevel === "Level C" ? "High-risk controlled substance requires enhanced safety protocols." : formula.riskLevel === "Level B" ? "Moderate complexity requires standard safety precautions." : "Simple formulation with minimal safety requirements."}`
    };
    
    setExtractedData(mockData);
    setCurrentStep('review');
    toast.success(`${formula.name} template loaded for assessment`);
  };

  const handleDataValidated = () => {
    if (extractedData) {
      setFinalAssessment(extractedData);
      setCurrentStep('report');
      toast.success("Risk assessment completed successfully");
    }
  };

  const handleDataUpdated = (updatedData: KeswickAssessmentData) => {
    setExtractedData(updatedData);
  };

  const handleStartOver = () => {
    setExtractedData(null);
    setFinalAssessment(null);
    setCurrentStep('upload');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-pharmacy-neutral p-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="outline" onClick={handleBack} size="sm" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-pharmacy-darkBlue">
                NAPRA Risk Assessment Tool
              </h1>
              <p className="text-sm text-pharmacy-gray">
                {TEST_CREDENTIALS.pharmacyName} • License: {TEST_CREDENTIALS.licenseNumber} • {TEST_CREDENTIALS.pharmacistName}
              </p>
            </div>
          </div>
          <div className="text-right">
            <ProvinceSelector 
              selectedProvince={selectedProvince}
              onProvinceChange={setSelectedProvince}
              showComplianceInfo={false}
            />
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-pharmacy-blue' : (currentStep === 'review' || currentStep === 'report') ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'upload' ? 'bg-pharmacy-blue text-white' : (currentStep === 'review' || currentStep === 'report') ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="font-medium">Upload Formula</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${currentStep === 'review' ? 'text-pharmacy-blue' : finalAssessment ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'review' ? 'bg-pharmacy-blue text-white' : finalAssessment ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="font-medium">Review & Assess</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${currentStep === 'report' ? 'text-pharmacy-blue' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'report' ? 'bg-pharmacy-blue text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="font-medium">Generate Report</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {currentStep === 'upload' && (
          <div className="space-y-6">
            {/* API Status */}
            <APIStatusDashboard />
            
            {/* Upload Options */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Document Upload */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-lg font-medium text-pharmacy-darkBlue mb-4 flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Formula Document
                </h2>
                <p className="text-pharmacy-gray mb-4">
                  Upload a PDF, JPG, or PNG of your compound formula. Our system will extract ingredients and safety data automatically.
                </p>
                <DocumentUploadSystem onDocumentProcessed={handleDocumentProcessed} />
              </div>

              {/* Sample Formulas */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-lg font-medium text-pharmacy-darkBlue mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Try Sample Formulas
                </h2>
                <p className="text-pharmacy-gray mb-4">
                  Test the system with these common compound formulas to see how the assessment process works.
                </p>
                <div className="space-y-3">
                  {SAMPLE_FORMULAS.map((formula, index) => (
                    <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleUseSampleFormula(formula)}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-pharmacy-darkBlue">{formula.name}</p>
                          <p className="text-sm text-pharmacy-gray">{formula.description}</p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          formula.riskLevel === 'Level A' ? 'bg-green-100 text-green-800' :
                          formula.riskLevel === 'Level B' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {formula.riskLevel}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'review' && extractedData && (
          <div>
            <KeswickDataReview
              extractedData={extractedData}
              onDataValidated={handleDataValidated}
              onDataUpdated={handleDataUpdated}
            />
          </div>
        )}

        {currentStep === 'report' && finalAssessment && (
          <div>
            <KeswickRiskAssessmentReport
              assessmentData={finalAssessment}
              onStartOver={handleStartOver}
              pharmacyInfo={TEST_CREDENTIALS}
              selectedProvince={selectedProvince}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NAPRARiskAssessment;
