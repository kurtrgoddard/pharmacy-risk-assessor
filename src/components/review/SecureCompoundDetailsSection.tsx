
import React from "react";
import { Input } from "@/components/ui/input";
import { 
  sanitizeString, 
  validateInput, 
  compoundNameSchema, 
  dinSchema 
} from "@/utils/inputValidation";
import { errorHandler } from "@/utils/errorHandling";
import { renderSafeHTML } from "@/utils/errorHandling";

interface SecureCompoundDetailsSectionProps {
  compoundName: string;
  din: string;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

const SecureCompoundDetailsSection: React.FC<SecureCompoundDetailsSectionProps> = ({
  compoundName,
  din,
  isEditing,
  onInputChange
}) => {
  const handleCompoundNameChange = (value: string) => {
    try {
      const sanitized = sanitizeString(value);
      validateInput(compoundNameSchema, sanitized, 'compound_name_edit');
      onInputChange("compoundName", sanitized);
    } catch (error) {
      errorHandler.logError(error, 'validation');
      // Still update with sanitized value
      onInputChange("compoundName", sanitizeString(value));
    }
  };

  const handleDinChange = (value: string) => {
    try {
      const sanitized = sanitizeString(value);
      validateInput(dinSchema, sanitized, 'din_edit');
      onInputChange("din", sanitized);
    } catch (error) {
      errorHandler.logError(error, 'validation');
      onInputChange("din", sanitizeString(value));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">
          Compound Name
        </label>
        {isEditing ? (
          <Input
            type="text"
            value={compoundName || ""}
            onChange={(e) => handleCompoundNameChange(e.target.value)}
            className="w-full"
            placeholder="Enter compound name"
            maxLength={200}
            autoComplete="off"
          />
        ) : (
          <div 
            className="w-full p-2 border rounded"
            dangerouslySetInnerHTML={{ 
              __html: renderSafeHTML(compoundName || "Not specified") 
            }}
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">
          DIN
        </label>
        {isEditing ? (
          <Input
            type="text"
            value={din || ""}
            onChange={(e) => handleDinChange(e.target.value)}
            className="w-full"
            placeholder="Enter DIN"
            maxLength={50}
            autoComplete="off"
          />
        ) : (
          <div 
            className="w-full p-2 border rounded"
            dangerouslySetInnerHTML={{ 
              __html: renderSafeHTML(din || "Not specified") 
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SecureCompoundDetailsSection;
