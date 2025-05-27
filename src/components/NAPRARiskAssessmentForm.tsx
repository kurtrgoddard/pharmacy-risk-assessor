
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";
import { KeswickAssessmentData } from '@/components/KeswickRiskAssessment';
import MobileFormWrapper from '@/components/ui/MobileFormWrapper';

// Import refactored components
import CompoundInfoSection from "./napra-form/CompoundInfoSection";
import CompoundingTypeSection from "./napra-form/CompoundingTypeSection";
import RiskLevelAssignmentSection from "./napra-form/RiskLevelAssignmentSection";
import RecommendedControlsSection from "./napra-form/RecommendedControlsSection";
import GuidelinesInfo from "./napra-form/GuidelinesInfo";

interface NAPRARiskAssessmentFormProps {
  initialData?: KeswickAssessmentData;
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const NAPRARiskAssessmentForm: React.FC<NAPRARiskAssessmentFormProps> = ({
  initialData,
  onComplete,
  onCancel,
}) => {
  const [assessment, setAssessment] = useState({
    compoundName: "",
    din: "",
    compoundingType: "",
    assignedRiskLevel: "",
    recommendedControls: {
      ppe: [],
      engineeringControls: [],
      otherControls: [],
    },
  });

  // Use the initialData to set up the form if provided
  useEffect(() => {
    if (initialData) {
      setAssessment(prevState => ({
        ...prevState,
        compoundName: initialData.compoundName || "",
        din: initialData.din || "",
        compoundingType: initialData.physicalCharacteristics?.includes("Semi-Solid") ? "Non-Sterile" : "",
        // Map Keswick risk levels to NAPRA risk levels (A, B, C)
        assignedRiskLevel: initialData.riskLevel?.includes("Level") ? initialData.riskLevel : "",
        recommendedControls: {
          ...prevState.recommendedControls,
          ppe: initialData.ppe ? 
            [
              initialData.ppe.gloves && "Gloves",
              initialData.ppe.gown && "Gown",
              initialData.ppe.mask && "Mask",
              initialData.ppe.eyeProtection && "Eye Protection"
            ].filter(Boolean) : [],
          engineeringControls: [],
          otherControls: [],
        }
      }));
    }
  }, [initialData]);

  const compoundingTypeOptions = ["Sterile", "Non-Sterile"];
  const riskLevelOptions = ["Level A", "Level B", "Level C"];
  const ppeOptions = ["Gloves", "Gown", "Mask", "Eye Protection"];
  const engineeringControlOptions = ["Containment Hood", "BSC", "HEPA Filter", "Ventilation"];

  const handleChange = (
    section: string,
    field: string,
    value: string | string[]
  ) => {
    setAssessment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxListChange = (
    section: string,
    field: string,
    value: string,
    checked: boolean
  ) => {
    setAssessment((prev) => {
      const currentValues = prev.recommendedControls[field] || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((item) => item !== value);

      return {
        ...prev,
        recommendedControls: {
          ...prev.recommendedControls,
          [field]: newValues,
        },
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(assessment);
  };

  return (
    <MobileFormWrapper>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="w-full">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">NAPRA Risk Assessment Form</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Fill out the form to assess the risk level and recommended controls
              for compounding.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Accordion type="single" collapsible className="space-y-2">
              <CompoundInfoSection 
                compoundName={assessment.compoundName}
                din={assessment.din}
                onValueChange={handleChange}
              />
              
              <CompoundingTypeSection 
                compoundingType={assessment.compoundingType}
                compoundingTypeOptions={compoundingTypeOptions}
                onValueChange={handleChange}
              />
              
              <RiskLevelAssignmentSection 
                assignedRiskLevel={assessment.assignedRiskLevel}
                riskLevelOptions={riskLevelOptions}
                onValueChange={handleChange}
              />
              
              <RecommendedControlsSection 
                ppeOptions={ppeOptions}
                engineeringControlOptions={engineeringControlOptions}
                selectedPPE={assessment.recommendedControls.ppe}
                selectedEngineeringControls={assessment.recommendedControls.engineeringControls}
                otherControls={assessment.recommendedControls.otherControls}
                onCheckboxListChange={handleCheckboxListChange}
                onValueChange={handleChange}
              />
            </Accordion>
            
            <div className="mt-6">
              <GuidelinesInfo />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between px-4 sm:px-6 pt-4 sm:pt-6">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onCancel}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!assessment.assignedRiskLevel}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              <Check className="mr-2 h-4 w-4" />
              Complete Assessment
            </Button>
          </CardFooter>
        </Card>
      </form>
    </MobileFormWrapper>
  );
};

export default NAPRARiskAssessmentForm;
