
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface RecommendedControlsSectionProps {
  ppeOptions: string[];
  engineeringControlOptions: string[];
  selectedPPE: string[];
  selectedEngineeringControls: string[];
  otherControls: string[];
  onCheckboxListChange: (section: string, field: string, value: string, checked: boolean) => void;
  onValueChange: (section: string, field: string, value: string[]) => void;
}

const RecommendedControlsSection: React.FC<RecommendedControlsSectionProps> = ({
  ppeOptions,
  engineeringControlOptions,
  selectedPPE,
  selectedEngineeringControls,
  otherControls,
  onCheckboxListChange,
  onValueChange,
}) => {
  return (
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
                    checked={selectedPPE.includes(ppe)}
                    onCheckedChange={(checked) => onCheckboxListChange(
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
                    checked={selectedEngineeringControls.includes(control)}
                    onCheckedChange={(checked) => onCheckboxListChange(
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
              value={otherControls.join("\n")}
              onChange={(e) => onValueChange(
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
  );
};

export default RecommendedControlsSection;
