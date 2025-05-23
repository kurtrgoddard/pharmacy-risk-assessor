
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>NAPRA Risk Assessment Form</CardTitle>
          <CardDescription>
            Fill out the form to assess the risk level and recommended controls
            for compounding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
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
          
          <GuidelinesInfo />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!assessment.assignedRiskLevel}>
            <Check className="mr-2 h-4 w-4" />
            Complete Assessment
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default NAPRARiskAssessmentForm;
