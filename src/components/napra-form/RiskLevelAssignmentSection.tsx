
import React from "react";
import { Label } from "@/components/ui/label";
import {
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

interface RiskLevelAssignmentSectionProps {
  assignedRiskLevel: string;
  riskLevelOptions: string[];
  onValueChange: (section: string, field: string, value: string | string[]) => void;
}

const RiskLevelAssignmentSection: React.FC<RiskLevelAssignmentSectionProps> = ({
  assignedRiskLevel,
  riskLevelOptions,
  onValueChange,
}) => {
  return (
    <AccordionItem value="item-3">
      <AccordionTrigger>Risk Level Assignment</AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-1">
          <Label>Assign Risk Level</Label>
          <Select
            value={assignedRiskLevel}
            onValueChange={(value) =>
              onValueChange("riskLevel", "assignedRiskLevel", value)
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
  );
};

export default RiskLevelAssignmentSection;
