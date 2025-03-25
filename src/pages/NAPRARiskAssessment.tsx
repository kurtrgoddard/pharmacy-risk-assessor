
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import NAPRARiskAssessmentForm from '@/components/NAPRARiskAssessmentForm';
import NAPRAAssessmentReport from '@/components/NAPRAAssessmentReport';
import { KeswickAssessmentData } from '@/components/KeswickRiskAssessment';

interface NAPRARiskAssessment {
  preparationName: string;
  preparedBy: string;
  reviewedBy: string;
  dateAssessed: string;
  complexityFactors: {
    requiresCalculations: boolean;
    requiresSpecializedEquipment: boolean;
    requiresSpecializedKnowledge: boolean;
    multipleIngredients: boolean;
    difficultPreparationProcess: boolean;
  };
  hazardousFactors: {
    containsNIOSHIngredients: boolean;
    containsWHMISIngredients: boolean;
    reproductiveRisk: boolean;
    respiratoryRisk: boolean;
    contactSensitizer: boolean;
  };
  frequencyVolume: {
    frequencyOfPreparation: "daily" | "weekly" | "monthly" | "rarely";
    volumePreparation: "large" | "medium" | "small";
  };
  concentrationRisk: boolean;
  exposureRisk: {
    routesOfExposure: string[];
    exposureDuration: "prolonged" | "moderate" | "minimal";
  };
  crossContaminationRisk: boolean;
  microbialContaminationRisk: boolean;
  assignedRiskLevel: "A" | "B" | "C" | "";
  riskJustification: string;
  recommendedControls: {
    engineeringControls: string[];
    administrativeControls: string[];
    ppe: string[];
    otherControls: string[];
  };
}

const NAPRARiskAssessmentPage = () => {
  const [assessment, setAssessment] = useState<NAPRARiskAssessment | null>(null);
  
  // Sample compound data - in a real app, this would come from a previous step or API
  const sampleCompoundData: KeswickAssessmentData = {
    compoundName: "Ketoprofen 10% in PLO Gel",
    din: "N/A (Compounded product)",
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
        sdsDescription: "Causes serious eye irritation. May cause respiratory irritation.",
        monographWarnings: "Contraindicated in patients with hypersensitivity to ketoprofen or other NSAIDs."
      }
    ],
    preparationDetails: {
      frequency: "Weekly",
      quantity: "100g",
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
      gloves: "Nitrile",
      gown: "Regular lab coat",
      mask: "Standard surgical mask",
      eyeProtection: true,
      otherPPE: []
    },
    safetyEquipment: {
      eyeWashStation: true,
      safetyShower: false
    },
    riskLevel: "",
    rationale: ""
  };
  
  const handleAssessmentComplete = (completed: NAPRARiskAssessment) => {
    setAssessment(completed);
    toast.success("NAPRA risk assessment completed");
  };
  
  const handleBackToForm = () => {
    setAssessment(null);
  };
  
  const handleBack = () => {
    // In a real app, this would navigate back to the previous page
    window.history.back();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-pharmacy-neutral p-4">
      <div className="w-full max-w-5xl mx-auto">
        {!assessment ? (
          <>
            <div className="mb-6 flex items-center">
              <Button variant="outline" onClick={handleBack} size="sm" className="mr-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h1 className="text-2xl font-semibold text-pharmacy-darkBlue">
                NAPRA Risk Assessment
              </h1>
            </div>
            
            <div className="glass-card rounded-xl p-6 mb-6">
              <h2 className="text-lg font-medium text-pharmacy-darkBlue mb-4">
                Complete NAPRA Risk Assessment for Non-Sterile Compounding
              </h2>
              <p className="text-pharmacy-gray mb-4">
                This form will guide you through the risk assessment process according to the NAPRA 
                Guidance Document for Pharmacy Compounding of Non-sterile Preparations. The assessment 
                will help determine the appropriate risk level (A, B, or C) for your compound.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-medium text-blue-900 mb-2">NAPRA Risk Levels</h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li><strong>Level A:</strong> Simple compounding with low risk.</li>
                  <li><strong>Level B:</strong> Complex compounding or moderate hazard.</li>
                  <li><strong>Level C:</strong> Complex compounding with high hazard.</li>
                </ul>
              </div>
              
              <NAPRARiskAssessmentForm 
                initialData={sampleCompoundData}
                onComplete={handleAssessmentComplete}
                onCancel={handleBack}
              />
            </div>
          </>
        ) : (
          <NAPRAAssessmentReport 
            assessment={assessment}
            onBack={handleBackToForm}
          />
        )}
      </div>
    </div>
  );
};

export default NAPRARiskAssessmentPage;
