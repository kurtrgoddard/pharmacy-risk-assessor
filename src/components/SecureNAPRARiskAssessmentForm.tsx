
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
import { Accordion } from "@/components/ui/accordion";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { KeswickAssessmentData } from '@/components/KeswickRiskAssessment';

// Import secure components
import SecureCompoundInfoSection from "./napra-form/SecureCompoundInfoSection";
import CompoundingTypeSection from "./napra-form/CompoundingTypeSection";
import RiskLevelAssignmentSection from "./napra-form/RiskLevelAssignmentSection";
import RecommendedControlsSection from "./napra-form/RecommendedControlsSection";
import GuidelinesInfo from "./napra-form/GuidelinesInfo";

// Import security utilities
import { 
  validateInput, 
  napraAssessmentSchema, 
  sanitizeObject 
} from "@/utils/inputValidation";
import { errorHandler, rateLimiter } from "@/utils/errorHandling";
import { scrubMedisca } from '@/utils/sanitise';

interface SecureNAPRARiskAssessmentFormProps {
  initialData?: KeswickAssessmentData;
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const SecureNAPRARiskAssessmentForm: React.FC<SecureNAPRARiskAssessmentFormProps> = ({
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the initialData to set up the form if provided
  useEffect(() => {
    if (initialData) {
      try {
        const sanitizedData = sanitizeObject(initialData);
        
        setAssessment(prevState => ({
          ...prevState,
          compoundName: sanitizedData.compoundName || "",
          din: sanitizedData.din || "",
          compoundingType: sanitizedData.physicalCharacteristics?.includes("Semi-Solid") ? "Non-Sterile" : "",
          assignedRiskLevel: sanitizedData.riskLevel?.includes("Level") ? sanitizedData.riskLevel : "",
          recommendedControls: {
            ...prevState.recommendedControls,
            ppe: sanitizedData.ppe ? 
              [
                sanitizedData.ppe.gloves && "Gloves",
                sanitizedData.ppe.gown && "Gown",
                sanitizedData.ppe.mask && "Mask",
                sanitizedData.ppe.eyeProtection && "Eye Protection"
              ].filter(Boolean) : [],
            engineeringControls: [],
            otherControls: [],
          }
        }));
      } catch (error) {
        errorHandler.logError(error, 'data_initialization');
        toast.error("Error initializing form data");
      }
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
    try {
      // Rate limiting check
      const identifier = `form_change_${Date.now()}`;
      if (rateLimiter.isRateLimited(identifier)) {
        toast.error("Please slow down your input");
        return;
      }

      setAssessment((prev) => ({
        ...prev,
        [field]: value,
      }));
    } catch (error) {
      errorHandler.logError(error, 'form_update');
      toast.error("Error updating form");
    }
  };

  const handleCheckboxListChange = (
    section: string,
    field: string,
    value: string,
    checked: boolean
  ) => {
    try {
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
    } catch (error) {
      errorHandler.logError(error, 'checkbox_update');
      toast.error("Error updating selection");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);

      // Rate limiting check for submissions
      const identifier = `submission_${Date.now()}`;
      if (rateLimiter.isRateLimited(identifier)) {
        toast.error("Please wait before submitting again");
        return;
      }

      // Validate the assessment data
      const validatedAssessment = validateInput(
        napraAssessmentSchema, 
        assessment, 
        'napra_assessment_submission'
      );

      // Additional security sanitization
      const sanitizedAssessment = sanitizeObject(validatedAssessment);
      
      // Remove any potential sensitive data
      const cleanedAssessment = scrubMedisca(sanitizedAssessment);

      onComplete(cleanedAssessment);
      toast.success("Assessment completed successfully");
      
    } catch (error) {
      errorHandler.logError(error, 'assessment_submission');
      toast.error("Please check your input and try again");
    } finally {
      setIsSubmitting(false);
    }
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
            <SecureCompoundInfoSection 
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
          <Button 
            type="submit" 
            disabled={!assessment.assignedRiskLevel || isSubmitting}
          >
            <Check className="mr-2 h-4 w-4" />
            {isSubmitting ? "Processing..." : "Complete Assessment"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default SecureNAPRARiskAssessmentForm;
