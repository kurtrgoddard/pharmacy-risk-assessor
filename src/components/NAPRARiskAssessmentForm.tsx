
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Info } from "lucide-react";
import { KeswickAssessmentData } from '@/components/KeswickRiskAssessment';

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
            <AccordionItem value="item-1">
              <AccordionTrigger>Compound Information</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="compound-name">Compound Name</Label>
                    <Input
                      type="text"
                      id="compound-name"
                      placeholder="Enter compound name"
                      value={assessment.compoundName}
                      onChange={(e) =>
                        handleChange("compoundInfo", "compoundName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="din">DIN</Label>
                    <Input
                      type="text"
                      id="din"
                      placeholder="Enter DIN"
                      value={assessment.din}
                      onChange={(e) => handleChange("compoundInfo", "din", e.target.value)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Compounding Type</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1">
                  <Label>Select Compounding Type</Label>
                  <Select
                    value={assessment.compoundingType}
                    onValueChange={(value) =>
                      handleChange("compoundingType", "compoundingType", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a compounding type" />
                    </SelectTrigger>
                    <SelectContent>
                      {compoundingTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Risk Level Assignment</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1">
                  <Label>Assign Risk Level</Label>
                  <Select
                    value={assessment.assignedRiskLevel}
                    onValueChange={(value) =>
                      handleChange("riskLevel", "assignedRiskLevel", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      {riskLevelOptions.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Recommended Controls</AccordionTrigger>
              <AccordionContent>
                <div>
                  <div>
                    <Label>Recommended PPE</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {ppeOptions.map((ppe) => (
                        <div key={ppe} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`ppe-${ppe}`}
                            checked={assessment.recommendedControls.ppe.includes(ppe)}
                            onCheckedChange={(checked) => handleCheckboxListChange(
                              "recommendedControls", "ppe", ppe, !!checked
                            )}
                          />
                          <Label htmlFor={`ppe-${ppe}`}>{ppe}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label>Engineering Controls</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {engineeringControlOptions.map((control) => (
                        <div key={control} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`engineering-${control}`}
                            checked={assessment.recommendedControls.engineeringControls.includes(control)}
                            onCheckedChange={(checked) => handleCheckboxListChange(
                              "recommendedControls", "engineeringControls", control, !!checked
                            )}
                          />
                          <Label htmlFor={`engineering-${control}`}>{control}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="other-controls">Other Control Measures</Label>
                    <Textarea 
                      id="other-controls"
                      placeholder="Enter any additional control measures"
                      value={assessment.recommendedControls.otherControls.join("\n")}
                      onChange={(e) => handleChange(
                        "recommendedControls", 
                        "otherControls", 
                        e.target.value.split("\n").filter(line => line.trim() !== "")
                      )}
                      className="mt-2"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">NAPRA Guidelines</h4>
                <p className="text-xs text-blue-800 mt-1">
                  <strong>Level A:</strong> Simple compounding with low risk, prepared in a non-segregated compounding area.<br />
                  <strong>Level B:</strong> Complex compounding or moderate hazard, requires segregated compounding area.<br />
                  <strong>Level C:</strong> Complex compounding with high hazard, requires dedicated room with appropriate C-PEC.
                </p>
              </div>
            </div>
          </div>
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
