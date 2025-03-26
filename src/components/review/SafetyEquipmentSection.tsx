
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";

interface SafetyEquipment {
  eyeWashStation: boolean;
  safetyShower: boolean;
  powderContainmentHood?: boolean;
  localExhaustVentilation?: boolean;
}

interface SafetyEquipmentSectionProps {
  safetyEquipment: SafetyEquipment;
  isEditing: boolean;
  onNestedObjectChange: (objectPath: string, field: string, value: any) => void;
  hasPowderHazard?: boolean;
}

const SafetyEquipmentSection: React.FC<SafetyEquipmentSectionProps> = ({
  safetyEquipment,
  isEditing,
  onNestedObjectChange,
  hasPowderHazard = false
}) => {
  return (
    <div>
      {hasPowderHazard && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md flex items-start">
          <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-orange-800">
            <p className="font-medium">Powder Hazard Detected</p>
            <p className="text-xs mt-1">Handling hazardous powders requires additional safety equipment including a powder containment hood and proper ventilation.</p>
          </div>
        </div>
      )}
    
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
        
        <div>
          <label className="block text-sm font-medium text-pharmacy-gray mb-1">
            Powder containment hood
            {hasPowderHazard && <span className="text-orange-500 ml-1">*</span>}
          </label>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={safetyEquipment.powderContainmentHood || false}
              onCheckedChange={(checked) => onNestedObjectChange("safetyEquipment", "powderContainmentHood", !!checked)}
              disabled={!isEditing}
              id="powder-containment-hood"
            />
            <label htmlFor="powder-containment-hood" className="text-sm text-pharmacy-gray">
              Available
            </label>
          </div>
          {hasPowderHazard && !safetyEquipment.powderContainmentHood && (
            <p className="text-xs text-orange-600 mt-1">Required for hazardous powders</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-pharmacy-gray mb-1">
            Local exhaust ventilation
            {hasPowderHazard && <span className="text-orange-500 ml-1">*</span>}
          </label>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={safetyEquipment.localExhaustVentilation || false}
              onCheckedChange={(checked) => onNestedObjectChange("safetyEquipment", "localExhaustVentilation", !!checked)}
              disabled={!isEditing}
              id="local-exhaust-ventilation"
            />
            <label htmlFor="local-exhaust-ventilation" className="text-sm text-pharmacy-gray">
              Available
            </label>
          </div>
          {hasPowderHazard && !safetyEquipment.localExhaustVentilation && (
            <p className="text-xs text-orange-600 mt-1">Required for hazardous powders</p>
          )}
        </div>
      </div>
      
      {hasPowderHazard && (
        <div className="mt-3 text-xs text-pharmacy-gray">
          <span className="text-orange-500">*</span> Required safety equipment for handling hazardous powders
        </div>
      )}
    </div>
  );
};

export default SafetyEquipmentSection;
