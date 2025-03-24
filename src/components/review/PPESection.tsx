
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface PPE {
  gloves: string;
  gown: string;
  mask: string;
  eyeProtection: boolean;
  otherPPE: string[];
}

interface PPESectionProps {
  ppe: PPE;
  otherPPEOptions: string[];
  isEditing: boolean;
  onPPEChange: (field: string, value: any) => void;
  onCheckboxListChange: (field: string, value: string, checked: boolean) => void;
}

const PPESection: React.FC<PPESectionProps> = ({
  ppe,
  otherPPEOptions,
  isEditing,
  onPPEChange,
  onCheckboxListChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Gloves</label>
        <Input
          type="text"
          value={ppe.gloves}
          onChange={(e) => onPPEChange("gloves", e.target.value)}
          disabled={!isEditing}
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Gown</label>
        <Input
          type="text"
          value={ppe.gown}
          onChange={(e) => onPPEChange("gown", e.target.value)}
          disabled={!isEditing}
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Mask</label>
        <Input
          type="text"
          value={ppe.mask}
          onChange={(e) => onPPEChange("mask", e.target.value)}
          disabled={!isEditing}
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Eye Protection Required</label>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={ppe.eyeProtection}
            onCheckedChange={(checked) => onPPEChange("eyeProtection", !!checked)}
            disabled={!isEditing}
            id="eye-protection-required"
          />
          <label htmlFor="eye-protection-required" className="text-sm text-pharmacy-gray">
            Required
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Other PPE</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherPPEOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`ppe-${option}`}
                checked={ppe.otherPPE.includes(option)}
                onCheckedChange={(checked) => onCheckboxListChange("ppe.otherPPE", option, !!checked)}
                disabled={!isEditing}
              />
              <label htmlFor={`ppe-${option}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PPESection;
