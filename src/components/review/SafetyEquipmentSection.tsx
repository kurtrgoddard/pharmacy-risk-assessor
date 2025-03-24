
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface SafetyEquipment {
  eyeWashStation: boolean;
  safetyShower: boolean;
}

interface SafetyEquipmentSectionProps {
  safetyEquipment: SafetyEquipment;
  isEditing: boolean;
  onNestedObjectChange: (objectPath: string, field: string, value: any) => void;
}

const SafetyEquipmentSection: React.FC<SafetyEquipmentSectionProps> = ({
  safetyEquipment,
  isEditing,
  onNestedObjectChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Eye wash station</label>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={safetyEquipment.eyeWashStation}
            onCheckedChange={(checked) => onNestedObjectChange("safetyEquipment", "eyeWashStation", !!checked)}
            disabled={!isEditing}
            id="eye-wash-station"
          />
          <label htmlFor="eye-wash-station" className="text-sm text-pharmacy-gray">
            Available
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Safety shower</label>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={safetyEquipment.safetyShower}
            onCheckedChange={(checked) => onNestedObjectChange("safetyEquipment", "safetyShower", !!checked)}
            disabled={!isEditing}
            id="safety-shower"
          />
          <label htmlFor="safety-shower" className="text-sm text-pharmacy-gray">
            Available
          </label>
        </div>
      </div>
    </div>
  );
};

export default SafetyEquipmentSection;
