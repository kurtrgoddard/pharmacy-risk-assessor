
import React from "react";
import { Input } from "@/components/ui/input";

interface CompoundDetailsSectionProps {
  compoundName: string;
  din: string;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

const CompoundDetailsSection: React.FC<CompoundDetailsSectionProps> = ({
  compoundName,
  din,
  isEditing,
  onInputChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Compound Name</label>
        <Input
          type="text"
          value={compoundName}
          onChange={(e) => onInputChange("compoundName", e.target.value)}
          disabled={!isEditing}
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">DIN</label>
        <Input
          type="text"
          value={din}
          onChange={(e) => onInputChange("din", e.target.value)}
          disabled={!isEditing}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default CompoundDetailsSection;
