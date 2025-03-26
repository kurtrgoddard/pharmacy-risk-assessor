
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Fan, ArrowDown, AlertCircle, AirVent, FlaskRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
          <FlaskRound className="w-4 h-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-orange-800">
            <p className="font-medium">Powder Hazard Detected</p>
            <p className="text-xs mt-1">Powder-based compounds require Level B classification and additional safety equipment including a powder containment hood and proper ventilation. These items have been automatically recommended below based on NAPRA guidelines.</p>
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
          <label className="flex items-center text-sm font-medium text-pharmacy-gray mb-1">
            Powder containment hood
            {hasPowderHazard && (
              <Badge className="ml-2 bg-orange-100 text-orange-800 border-orange-200">
                Required
              </Badge>
            )}
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
            <div className="flex items-center mt-1 text-xs text-red-600">
              <AlertCircle className="w-3 h-3 mr-1" />
              <span>Mandatory for powder formulations per NAPRA/USP guidelines</span>
            </div>
          )}
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-pharmacy-gray mb-1">
            Local exhaust ventilation
            {hasPowderHazard && (
              <Badge className="ml-2 bg-orange-100 text-orange-800 border-orange-200">
                Required
              </Badge>
            )}
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
            <div className="flex items-center mt-1 text-xs text-red-600">
              <AlertCircle className="w-3 h-3 mr-1" />
              <span>Mandatory for powder formulations per NAPRA/USP guidelines</span>
            </div>
          )}
        </div>
      </div>
      
      {hasPowderHazard && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md flex items-start">
          <AirVent className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-xs text-blue-700">
            <p className="font-medium">Critical Ventilation Requirements for Powder Formulations</p>
            <ul className="list-disc list-inside mt-1">
              <li>Powder containment hood with HEPA filtration required for all powder ingredients</li>
              <li>Dedicated ventilation system with negative pressure for hazardous powders</li>
              <li>Regular verification of airflow and filtration systems</li>
              <li>Separate area from other compounding activities when handling powders</li>
              <li>All powder formulations must be classified as Level B minimum</li>
              <li><strong>Special attention for narcotic powders like Ketamine and Baclofen</strong></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyEquipmentSection;
