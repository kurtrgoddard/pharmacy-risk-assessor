
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PDFViewerWrapper from "./pdf/PDFViewerWrapper";

export interface ActiveIngredient {
  name: string;
  manufacturer: string;
  nioshStatus: {
    isOnNioshList: boolean;
    table?: string;
    hazardLevel?: "High Hazard" | "Moderate Hazard" | "Non-Hazardous";
    hazardType?: string[];
  };
  reproductiveToxicity: boolean;
  whmisHazards: boolean;
  sdsDescription: string;
  monographWarnings: string;
}

export interface KeswickAssessmentData {
  compoundName: string;
  din: string;
  activeIngredients: ActiveIngredient[];
  preparationDetails: {
    frequency: string;
    quantity: string;
    concentrationRisk: boolean;
  };
  physicalCharacteristics: string[];
  equipmentRequired: string[];
  safetyChecks: {
    specialEducation: {
      required: boolean;
      description?: string;
    };
    verificationRequired: boolean;
    equipmentAvailable: boolean;
    ventilationRequired: boolean;
  };
  workflowConsiderations: {
    uninterruptedWorkflow: {
      status: boolean;
      measures?: string;
    };
    microbialContaminationRisk: boolean;
    crossContaminationRisk: boolean;
  };
  exposureRisks: string[];
  ppe: {
    gloves: string;
    gown: string;
    mask: string;
    eyeProtection: boolean;
    otherPPE: string[];
  };
  safetyEquipment: {
    eyeWashStation: boolean;
    safetyShower: boolean;
  };
  riskLevel: string;
  rationale: string;
}

interface KeswickRiskAssessmentProps {
  assessmentData: KeswickAssessmentData;
  fileName: string;
  onStartOver: () => void;
}

const KeswickRiskAssessment: React.FC<KeswickRiskAssessmentProps> = ({
  assessmentData,
  fileName,
  onStartOver,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 assessment-appear">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-pharmacy-darkBlue mb-2">
          Risk Assessment Document
        </h2>
        <p className="text-pharmacy-gray">
          Here is your generated risk assessment document.
        </p>
      </div>
      
      <PDFViewerWrapper assessmentData={assessmentData} fileName={fileName} />

      <div className="mt-8 flex justify-center">
        <Button
          variant="outline"
          onClick={onStartOver}
          className="flex items-center text-pharmacy-darkBlue hover:text-pharmacy-blue transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Start Over
        </Button>
      </div>
    </div>
  );
};

export default KeswickRiskAssessment;
