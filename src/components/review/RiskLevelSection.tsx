import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, Info, AlertTriangle, AirVent, HardHat, FlaskRound, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const renderRiskLevelDetails = (level: string) => {
    switch (level) {
      case "Level A":
        return (
          <div className="p-3 bg-green-50 border border-green-100 rounded-md mt-2">
            <h4 className="text-sm font-medium text-green-800 mb-1">Level A Requirements</h4>
            <ul className="list-disc list-inside text-xs text-green-700">
              <li>Small-scale, simple preparations</li>
              <li>Standard operating procedures</li>
              <li>Basic PPE (gloves, mask, designated jacket)</li>
              <li>Good airflow but no special ventilation needed</li>
              <li>Regular compounding area with cleaning protocols</li>
              <li className="font-medium">Non-powder formulations only</li>
            </ul>
          </div>
        );
      case "Level B":
        return (
          <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-md mt-2">
            <h4 className="text-sm font-medium text-yellow-800 mb-1">Level B Requirements</h4>
            <ul className="list-disc list-inside text-xs text-yellow-700">
              <li>Moderate complexity with specific risk factors</li>
              <li>Multi-ingredient compounds</li>
              <li className="font-medium">All powder formulations (mandatory)</li>
              <li>Segregated compounding area recommended</li>
              <li>Enhanced PPE (double gloves, gown, mask, eye protection)</li>
              <li className="font-medium">Dedicated equipment and ventilation systems</li>
              <li className="font-medium">Powder containment hood for powder formulations</li>
              <li>Special training for compounding personnel</li>
            </ul>
            
            <div className="mt-2 p-2 bg-yellow-100 rounded flex items-start">
              <AirVent className="w-4 h-4 text-yellow-700 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800">
                <span className="font-medium">Required Safety Equipment:</span> Proper ventilation systems and powder containment hood must be used for all powder formulations and multi-ingredient compounds.
              </p>
            </div>
          </div>
        );
      case "Level C":
        return (
          <div className="p-3 bg-red-50 border border-red-100 rounded-md mt-2">
            <h4 className="text-sm font-medium text-red-800 mb-1">Level C Requirements</h4>
            <ul className="list-disc list-inside text-xs text-red-700">
              <li>Hazardous drugs (NIOSH Table 1) or complex preparations</li>
              <li>Dedicated room with negative pressure</li>
              <li className="font-medium">Containment primary engineering control (C-PEC)</li>
              <li>Full PPE (chemotherapy gloves, hazardous gown, N95 mask)</li>
              <li>Comprehensive decontamination protocols</li>
              <li>Special handling, storage, and disposal procedures</li>
              <li>Advanced certification and training requirements</li>
            </ul>
            
            <div className="mt-2 p-2 bg-red-100 rounded flex items-start">
              <AlertCircle className="w-4 h-4 text-red-700 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-800">
                <span className="font-medium">Critical Safety Alert:</span> All compounding must be performed in a containment hood with appropriate ventilation. Powder handling requires specialized containment equipment and rigorous procedures.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <div className="flex items-center mb-1">
          <label className="block text-sm font-medium text-pharmacy-gray">Risk Level Assigned (NAPRA)</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="ml-2 cursor-help">
                  <Info className="h-4 w-4 text-pharmacy-blue" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p className="text-sm">Risk levels are assigned based on NAPRA guidelines considering ingredient hazards, 
                preparation complexity, and required safety measures. All powder formulations must be Level B or higher.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {isEditing ? (
          <Select 
            value={riskLevel} 
            onValueChange={(value) => onInputChange("riskLevel", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Level A">Level A - Simple (Non-powder)</SelectItem>
              <SelectItem value="Level B">Level B - Moderate/Powder Formulations</SelectItem>
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
        <div className="flex items-center mb-1">
          <label className="block text-sm font-medium text-pharmacy-gray">Rationale (According to NAPRA Decision Algorithm)</label>
          {!isEditing && riskLevel && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="ml-2 cursor-help">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-md">
                  <p className="text-sm">This rationale explains why this compound received its risk level 
                  classification based on ingredient hazards and preparation characteristics.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <Textarea
          value={rationale}
          onChange={(e) => onInputChange("rationale", e.target.value)}
          disabled={!isEditing}
          className="w-full min-h-[120px]"
          placeholder="Explain the reasoning for this risk level assignment based on NAPRA guidelines..."
        />
        
        {!isEditing && riskLevel && renderRiskLevelDetails(riskLevel)}
        
        {!isEditing && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
            <h4 className="text-sm font-medium text-pharmacy-darkBlue mb-1">NAPRA Risk Level Guidelines</h4>
            <ul className="list-disc list-inside text-xs text-pharmacy-gray">
              <li><span className="font-medium">Level A:</span> Simple non-powder preparations with minimal risk</li>
              <li><span className="font-medium">Level B:</span> Moderate complexity, <span className="font-medium">all powder formulations</span>, multi-ingredient compounds requiring special precautions</li>
              <li><span className="font-medium">Level C:</span> Complex/hazardous drugs (NIOSH Group 1 or WHMIS hazards)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskLevelSection;
