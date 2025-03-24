
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface SafetyChecks {
  specialEducation: {
    required: boolean;
    description?: string;
  };
  verificationRequired: boolean;
  equipmentAvailable: boolean;
  ventilationRequired: boolean;
}

interface SafetyChecksSectionProps {
  safetyChecks: SafetyChecks;
  isEditing: boolean;
  onNestedObjectChange: (objectPath: string, field: string, value: any) => void;
}

const SafetyChecksSection: React.FC<SafetyChecksSectionProps> = ({
  safetyChecks,
  isEditing,
  onNestedObjectChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Special education or competencies required</label>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={safetyChecks.specialEducation.required}
            onCheckedChange={(checked) => onNestedObjectChange("safetyChecks", "specialEducation", { ...safetyChecks.specialEducation, required: !!checked })}
            disabled={!isEditing}
            id="special-education-required"
          />
          <label htmlFor="special-education-required" className="text-sm text-pharmacy-gray">
            Required
          </label>
        </div>
        {safetyChecks.specialEducation.required && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-pharmacy-gray mb-1">Description</label>
            <Textarea
              value={safetyChecks.specialEducation.description || ""}
              onChange={(e) => onNestedObjectChange("safetyChecks", "specialEducation", { ...safetyChecks.specialEducation, description: e.target.value })}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Visual verification required</label>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={safetyChecks.verificationRequired}
            onCheckedChange={(checked) => onNestedObjectChange("safetyChecks", "verificationRequired", !!checked)}
            disabled={!isEditing}
            id="verification-required"
          />
          <label htmlFor="verification-required" className="text-sm text-pharmacy-gray">
            Required
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Appropriate facilities/equipment available</label>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={safetyChecks.equipmentAvailable}
            onCheckedChange={(checked) => onNestedObjectChange("safetyChecks", "equipmentAvailable", !!checked)}
            disabled={!isEditing}
            id="equipment-available"
          />
          <label htmlFor="equipment-available" className="text-sm text-pharmacy-gray">
            Available
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Ventilation required</label>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={safetyChecks.ventilationRequired}
            onCheckedChange={(checked) => onNestedObjectChange("safetyChecks", "ventilationRequired", !!checked)}
            disabled={!isEditing}
            id="ventilation-required"
          />
          <label htmlFor="ventilation-required" className="text-sm text-pharmacy-gray">
            Required
          </label>
        </div>
      </div>
    </div>
  );
};

export default SafetyChecksSection;
