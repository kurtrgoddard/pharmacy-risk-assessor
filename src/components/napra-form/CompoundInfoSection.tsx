
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CompoundInfoSectionProps {
  compoundName: string;
  din: string;
  onValueChange: (field: string, value: string) => void;
}

const CompoundInfoSection: React.FC<CompoundInfoSectionProps> = ({
  compoundName,
  din,
  onValueChange,
}) => {
  return (
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
              value={compoundName}
              onChange={(e) =>
                onValueChange("compoundName", e.target.value)
              }
            />
          </div>
          <div>
            <Label htmlFor="din">DIN</Label>
            <Input
              type="text"
              id="din"
              placeholder="Enter DIN"
              value={din}
              onChange={(e) => onValueChange("din", e.target.value)}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CompoundInfoSection;
