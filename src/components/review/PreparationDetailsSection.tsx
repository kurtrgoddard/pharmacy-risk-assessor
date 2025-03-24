
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface PreparationDetails {
  frequency: string;
  quantity: string;
  concentrationRisk: boolean;
}

interface PreparationDetailsSectionProps {
  preparationDetails: PreparationDetails;
  isEditing: boolean;
  onNestedObjectChange: (objectPath: string, field: string, value: any) => void;
}

const PreparationDetailsSection: React.FC<PreparationDetailsSectionProps> = ({
  preparationDetails,
  isEditing,
  onNestedObjectChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Frequency of Preparation</label>
        <Input
          type="text"
          value={preparationDetails.frequency}
          onChange={(e) => onNestedObjectChange("preparationDetails", "frequency", e.target.value)}
          disabled={!isEditing}
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Quantity Prepared (Average)</label>
        <Input
          type="text"
          value={preparationDetails.quantity}
          onChange={(e) => onNestedObjectChange("preparationDetails", "quantity", e.target.value)}
          disabled={!isEditing}
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Concentration presents health risk</label>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={preparationDetails.concentrationRisk}
            onCheckedChange={(checked) => onNestedObjectChange("preparationDetails", "concentrationRisk", !!checked)}
            disabled={!isEditing}
            id="concentration-risk"
          />
          <label htmlFor="concentration-risk" className="text-sm text-pharmacy-gray">
            Presents Health Risk
          </label>
        </div>
      </div>
    </div>
  );
};

export default PreparationDetailsSection;
