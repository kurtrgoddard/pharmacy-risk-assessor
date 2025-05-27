
import React, { useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EnhancedFormField } from "@/components/ui/enhanced-form-field";
import { 
  sanitizeString, 
  validateInput, 
  compoundNameSchema, 
  dinSchema 
} from "@/utils/inputValidation";
import { errorHandler } from "@/utils/errorHandling";
import { useNotifications } from "@/hooks/useNotifications";

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
  const [fieldErrors, setFieldErrors] = useState<{ compoundName?: string; din?: string }>({});
  const [fieldSuccess, setFieldSuccess] = useState<{ compoundName?: boolean; din?: boolean }>({});
  const { showInvalidInput } = useNotifications();

  const handleCompoundNameChange = (value: string) => {
    try {
      const sanitized = sanitizeString(value);
      validateInput(compoundNameSchema, sanitized, 'compound_name');
      
      setFieldErrors(prev => ({ ...prev, compoundName: undefined }));
      setFieldSuccess(prev => ({ ...prev, compoundName: true }));
      onValueChange("compoundInfo", "compoundName", sanitized);
    } catch (error: any) {
      errorHandler.logError(error, 'validation');
      const errorMessage = "Enter a valid compound name (2-200 characters, letters, numbers, spaces, and common symbols only)";
      setFieldErrors(prev => ({ ...prev, compoundName: errorMessage }));
      setFieldSuccess(prev => ({ ...prev, compoundName: false }));
      showInvalidInput("compound name", "Use only letters, numbers, spaces, and common chemical symbols");
      onValueChange("compoundInfo", "compoundName", sanitizeString(value));
    }
  };

  const handleDinChange = (value: string) => {
    try {
      const sanitized = sanitizeString(value);
      validateInput(dinSchema, sanitized, 'din');
      
      setFieldErrors(prev => ({ ...prev, din: undefined }));
      setFieldSuccess(prev => ({ ...prev, din: true }));
      onValueChange("compoundInfo", "din", sanitized);
    } catch (error: any) {
      errorHandler.logError(error, 'validation');
      const errorMessage = "Enter a valid DIN (8 digits) or indicate if not applicable";
      setFieldErrors(prev => ({ ...prev, din: errorMessage }));
      setFieldSuccess(prev => ({ ...prev, din: false }));
      showInvalidInput("DIN", "Must be 8 digits or 'N/A' for compounded products");
      onValueChange("compoundInfo", "din", sanitizeString(value));
    }
  };

  return (
    <AccordionItem value="item-1">
      <AccordionTrigger>Compound Information</AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EnhancedFormField
            id="compound-name"
            label="Compound Name"
            value={compoundName}
            onChange={handleCompoundNameChange}
            placeholder="Enter compound name (e.g., Ketoprofen 10% PLO Gel)"
            maxLength={200}
            minLength={2}
            required
            tooltip="Enter the complete name of the compound including strength and dosage form. Use clear, descriptive names that identify the preparation."
            helpText="Include active ingredient(s), strength, and dosage form"
            error={fieldErrors.compoundName}
            success={fieldSuccess.compoundName}
          />

          <EnhancedFormField
            id="din"
            label="Drug Identification Number (DIN)"
            value={din}
            onChange={handleDinChange}
            placeholder="Enter 8-digit DIN or 'N/A'"
            maxLength={50}
            tooltip="Enter the 8-digit DIN if this is a licensed product. For compounded preparations without a DIN, enter 'N/A' or 'Compounded product'."
            helpText="8-digit number for licensed products, or 'N/A' for compounded products"
            error={fieldErrors.din}
            success={fieldSuccess.din}
            pattern="^(\d{8}|N/A|n/a|Not applicable|Compounded product).*$"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SecureCompoundInfoSection;
