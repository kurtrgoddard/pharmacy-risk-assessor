
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, Info } from "lucide-react";

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
  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case "Level A":
        return <ShieldCheck className="w-4 h-4 text-green-500" />;
      case "Level B":
        return <ShieldAlert className="w-4 h-4 text-yellow-500" />;
      case "Level C":
        return <ShieldAlert className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getRiskLevelDescription = (level: string) => {
    switch (level) {
      case "Level A":
        return "Simple preparations with minimal risk (basic handling procedures)";
      case "Level B":
        return "Moderate complexity requiring special precautions and ventilation";
      case "Level C":
        return "Complex/hazardous drugs requiring significant protective measures";
      default:
        return "Select a risk level";
    }
  };

  const getRiskLevelBadgeColor = (level: string) => {
    switch (level) {
      case "Level A":
        return "bg-green-100 text-green-800 border-green-200";
      case "Level B":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Level C":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Risk Level Assigned (NAPRA)</label>
        {isEditing ? (
          <Select 
            value={riskLevel} 
            onValueChange={(value) => onInputChange("riskLevel", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Level A">Level A - Simple</SelectItem>
              <SelectItem value="Level B">Level B - Moderate</SelectItem>
              <SelectItem value="Level C">Level C - Complex/Hazardous</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="flex items-center">
            <Badge className={`mr-2 ${getRiskLevelBadgeColor(riskLevel)}`}>
              {getRiskLevelIcon(riskLevel)} <span className="ml-1">{riskLevel}</span>
            </Badge>
            <span className="text-sm text-pharmacy-gray">{getRiskLevelDescription(riskLevel)}</span>
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Rationale (According to NAPRA Decision Algorithm)</label>
        <Textarea
          value={rationale}
          onChange={(e) => onInputChange("rationale", e.target.value)}
          disabled={!isEditing}
          className="w-full min-h-[120px]"
          placeholder="Explain the reasoning for this risk level assignment based on NAPRA guidelines..."
        />
        
        {!isEditing && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
            <h4 className="text-sm font-medium text-pharmacy-darkBlue mb-1">NAPRA Risk Level Guidelines</h4>
            <ul className="list-disc list-inside text-xs text-pharmacy-gray">
              <li><span className="font-medium">Level A:</span> Simple preparations with minimal risk</li>
              <li><span className="font-medium">Level B:</span> Moderate complexity requiring special precautions</li>
              <li><span className="font-medium">Level C:</span> Complex/hazardous drugs (NIOSH Group 1 or WHMIS hazards)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskLevelSection;
