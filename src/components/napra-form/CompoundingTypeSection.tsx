
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

interface CompoundingTypeSectionProps {
  compoundingType: string;
  compoundingTypeOptions: string[];
  onValueChange: (section: string, field: string, value: string | string[]) => void;
}

const CompoundingTypeSection: React.FC<CompoundingTypeSectionProps> = ({
  compoundingType,
  compoundingTypeOptions,
  onValueChange,
}) => {
  return (
    <AccordionItem value="item-2">
      <AccordionTrigger>Compounding Type</AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-1">
          <Label>Select Compounding Type</Label>
          <Select
            value={compoundingType}
            onValueChange={(value) =>
              onValueChange("compoundingType", "compoundingType", value)
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
  );
};

export default CompoundingTypeSection;
