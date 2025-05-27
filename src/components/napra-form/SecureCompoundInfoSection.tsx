
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  sanitizeString, 
  validateInput, 
  compoundNameSchema, 
  dinSchema 
} from "@/utils/inputValidation";
import { errorHandler } from "@/utils/errorHandling";

interface SecureCompoundInfoSectionProps {
  compoundName: string;
  din: string;
  onValueChange: (section: string, field: string, value: string | string[]) => void;
}

const SecureCompoundInfoSection: React.FC<SecureCompoundInfoSectionProps> = ({
  compoundName,
  din,
  onValueChange,
}) => {
  const handleCompoundNameChange = (value: string) => {
    try {
      const sanitized = sanitizeString(value);
      validateInput(compoundNameSchema, sanitized, 'compound_name');
      onValueChange("compoundInfo", "compoundName", sanitized);
    } catch (error) {
      errorHandler.logError(error, 'validation');
      // Still update with sanitized value but log the error
      onValueChange("compoundInfo", "compoundName", sanitizeString(value));
    }
  };

  const handleDinChange = (value: string) => {
    try {
      const sanitized = sanitizeString(value);
      validateInput(dinSchema, sanitized, 'din');
      onValueChange("compoundInfo", "din", sanitized);
    } catch (error) {
      errorHandler.logError(error, 'validation');
      onValueChange("compoundInfo", "din", sanitizeString(value));
    }
  };

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
              onChange={(e) => handleCompoundNameChange(e.target.value)}
              maxLength={200}
              autoComplete="off"
            />
          </div>
          <div>
            <Label htmlFor="din">DIN</Label>
            <Input
              type="text"
              id="din"
              placeholder="Enter DIN"
              value={din}
              onChange={(e) => handleDinChange(e.target.value)}
              maxLength={50}
              autoComplete="off"
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SecureCompoundInfoSection;
