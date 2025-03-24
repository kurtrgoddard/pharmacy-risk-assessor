
import React from "react";
import { AlertTriangle, AlertCircle, Shield } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ActiveIngredient } from "../KeswickRiskAssessment";
import { HazardLevel } from "@/utils/nioshData";

interface ActiveIngredientsSectionProps {
  activeIngredients: ActiveIngredient[];
  isEditing: boolean;
  onActiveIngredientChange: (index: number, field: string, value: any) => void;
}

const ActiveIngredientsSection: React.FC<ActiveIngredientsSectionProps> = ({
  activeIngredients,
  isEditing,
  onActiveIngredientChange
}) => {
  // Get hazard badge styling based on hazard level
  const getHazardBadge = (hazardLevel?: HazardLevel) => {
    switch (hazardLevel) {
      case "High Hazard":
        return (
          <Badge className="bg-red-500 text-white hover:bg-red-600">
            <AlertTriangle className="w-3 h-3 mr-1" />
            High Hazard
          </Badge>
        );
      case "Moderate Hazard":
        return (
          <Badge className="bg-orange-500 text-white hover:bg-orange-600">
            <AlertCircle className="w-3 h-3 mr-1" />
            Moderate Hazard
          </Badge>
        );
      default:
        return (
          <Badge className="bg-green-500 text-white hover:bg-green-600">
            <Shield className="w-3 h-3 mr-1" />
            Non-Hazardous
          </Badge>
        );
    }
  };

  return (
    <>
      {activeIngredients.map((ingredient, index) => (
        <div key={index} className="mb-4 p-4 rounded-md shadow-sm border border-gray-200">
          <h4 className="text-sm font-medium text-pharmacy-darkBlue mb-2">Ingredient #{index + 1}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-pharmacy-gray mb-1">Name</label>
              <Input
                type="text"
                value={ingredient.name}
                onChange={(e) => onActiveIngredientChange(index, "name", e.target.value)}
                disabled={!isEditing}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pharmacy-gray mb-1">Manufacturer</label>
              <Input
                type="text"
                value={ingredient.manufacturer}
                onChange={(e) => onActiveIngredientChange(index, "manufacturer", e.target.value)}
                disabled={!isEditing}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pharmacy-gray mb-1">NIOSH Listed</label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={ingredient.nioshStatus.isOnNioshList}
                  onCheckedChange={(checked) => onActiveIngredientChange(index, "nioshStatus.isOnNioshList", !!checked)}
                  disabled={!isEditing}
                  id={`niosh-listed-${index}`}
                />
                <label htmlFor={`niosh-listed-${index}`} className="text-sm text-pharmacy-gray">
                  Is on NIOSH List
                </label>
              </div>
            </div>
            {ingredient.nioshStatus.isOnNioshList && (
              <>
                <div>
                  <label className="block text-sm font-medium text-pharmacy-gray mb-1">NIOSH Table</label>
                  <Input
                    type="text"
                    value={ingredient.nioshStatus.table || ""}
                    onChange={(e) => onActiveIngredientChange(index, "nioshStatus.table", e.target.value)}
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-pharmacy-gray mb-1">Hazard Level</label>
                  {getHazardBadge(ingredient.nioshStatus.hazardLevel)}
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-pharmacy-gray mb-1">Reproductive Toxicity</label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={ingredient.reproductiveToxicity}
                  onCheckedChange={(checked) => onActiveIngredientChange(index, "reproductiveToxicity", !!checked)}
                  disabled={!isEditing}
                  id={`reproductive-toxicity-${index}`}
                />
                <label htmlFor={`reproductive-toxicity-${index}`} className="text-sm text-pharmacy-gray">
                  Toxic to Reproduction
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-pharmacy-gray mb-1">WHMIS Hazards</label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={ingredient.whmisHazards}
                  onCheckedChange={(checked) => onActiveIngredientChange(index, "whmisHazards", !!checked)}
                  disabled={!isEditing}
                  id={`whmis-hazards-${index}`}
                />
                <label htmlFor={`whmis-hazards-${index}`} className="text-sm text-pharmacy-gray">
                  WHMIS Health Hazards
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-pharmacy-gray mb-1">SDS Description</label>
              <Textarea
                value={ingredient.sdsDescription}
                onChange={(e) => onActiveIngredientChange(index, "sdsDescription", e.target.value)}
                disabled={!isEditing}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pharmacy-gray mb-1">Monograph Warnings</label>
              <Textarea
                value={ingredient.monographWarnings}
                onChange={(e) => onActiveIngredientChange(index, "monographWarnings", e.target.value)}
                disabled={!isEditing}
                className="w-full"
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ActiveIngredientsSection;
