
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface RiskLevelSectionProps {
  riskLevel: string;
  rationale: string;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

const RiskLevelSection: React.FC<RiskLevelSectionProps> = ({
  riskLevel,
  rationale,
  isEditing,
  onInputChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Risk Level Assigned</label>
        <Input
          type="text"
          value={riskLevel}
          onChange={(e) => onInputChange("riskLevel", e.target.value)}
          disabled={!isEditing}
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Rationale</label>
        <Textarea
          value={rationale}
          onChange={(e) => onInputChange("rationale", e.target.value)}
          disabled={!isEditing}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default RiskLevelSection;
