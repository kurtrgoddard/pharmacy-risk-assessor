
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, ShieldCheck, ShieldAlert, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SDSInfoSection from "./SDSInfoSection";

interface ActiveIngredient {
  name: string;
  manufacturer: string;
  nioshStatus: {
    isOnNioshList: boolean;
    hazardLevel: string;
    hazardType: string[];
    table?: string;
  };
  reproductiveToxicity: boolean;
  whmisHazards: boolean;
  sdsDescription: string;
  monographWarnings: string;
  sdsData?: {
    ingredientName: string;
    physicalForm?: string;
    hazardClassification: {
      ghs: string[];
      whmis: string[];
    };
    recommendedPPE: {
      gloves: string;
      respiratoryProtection: string;
      eyeProtection: string;
      bodyProtection: string;
    };
    exposureRisks: string[];
    handlingPrecautions: string[];
    timestamp: number;
  };
}

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
  return (
    <div className="space-y-4">
      {activeIngredients.map((ingredient, index) => (
        <div key={index} className="p-4 border rounded-md bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-pharmacy-gray mb-1">Ingredient Name</label>
              <Input
                value={ingredient.name}
                onChange={(e) => onActiveIngredientChange(index, "name", e.target.value)}
                disabled={!isEditing}
                placeholder="Ingredient name"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pharmacy-gray mb-1">
                Manufacturer
              </label>
              <Input
                value={ingredient.manufacturer}
                onChange={(e) => onActiveIngredientChange(index, "manufacturer", e.target.value)}
                disabled={!isEditing}
                placeholder="Manufacturer (optional)"
                className="w-full"
              />
            </div>
          </div>
          
          {isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">NIOSH Status</label>
                <Select
                  value={ingredient.nioshStatus.table || "none"}
                  onValueChange={(value) => {
                    onActiveIngredientChange(index, "nioshStatus.table", value === "none" ? null : value);
                    // Update hazard level based on table selection
                    let hazardLevel = "Non-Hazardous";
                    if (value === "Table 1") hazardLevel = "High Hazard";
                    if (value === "Table 2") hazardLevel = "Moderate Hazard";
                    onActiveIngredientChange(index, "nioshStatus.hazardLevel", hazardLevel);
                  }}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select NIOSH status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not on NIOSH list</SelectItem>
                    <SelectItem value="Table 1">Table 1 (High Hazard)</SelectItem>
                    <SelectItem value="Table 2">Table 2 (Moderate Hazard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">WHMIS Hazards</label>
                <Select
                  value={ingredient.whmisHazards ? "yes" : "no"}
                  onValueChange={(value) => onActiveIngredientChange(index, "whmisHazards", value === "yes")}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="WHMIS hazards?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Reproductive Toxicity</label>
                <Select
                  value={ingredient.reproductiveToxicity ? "yes" : "no"}
                  onValueChange={(value) => onActiveIngredientChange(index, "reproductiveToxicity", value === "yes")}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Reproductive toxicity?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {!isEditing && (
            <div className="flex flex-wrap gap-2 mb-3">
              {ingredient.nioshStatus.table ? (
                <Badge className={ingredient.nioshStatus.table === "Table 1" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"}>
                  <Shield className="w-3 h-3 mr-1" />
                  NIOSH {ingredient.nioshStatus.table}
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-800">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Not on NIOSH list
                </Badge>
              )}
              
              {ingredient.whmisHazards && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  WHMIS Hazards
                </Badge>
              )}
              
              {ingredient.reproductiveToxicity && (
                <Badge className="bg-purple-100 text-purple-800">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Reproductive Toxicity
                </Badge>
              )}
              
              {ingredient.manufacturer && (
                <Badge className="bg-blue-100 text-blue-800">
                  {ingredient.manufacturer}
                </Badge>
              )}
            </div>
          )}
          
          {isEditing && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-pharmacy-gray mb-1">SDS Description</label>
              <Textarea
                value={ingredient.sdsDescription}
                onChange={(e) => onActiveIngredientChange(index, "sdsDescription", e.target.value)}
                disabled={!isEditing}
                placeholder="SDS description"
                className="w-full"
              />
            </div>
          )}
          
          {isEditing && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-pharmacy-gray mb-1">Monograph Warnings</label>
              <Textarea
                value={ingredient.monographWarnings}
                onChange={(e) => onActiveIngredientChange(index, "monographWarnings", e.target.value)}
                disabled={!isEditing}
                placeholder="Monograph warnings"
                className="w-full"
              />
            </div>
          )}
          
          <SDSInfoSection
            ingredientName={ingredient.name}
            sdsData={ingredient.sdsData || null}
            isLoading={false}
          />
        </div>
      ))}
      
      {isEditing && (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onActiveIngredientChange(activeIngredients.length, "add", {
              name: "",
              manufacturer: "",
              nioshStatus: {
                isOnNioshList: false,
                hazardLevel: "Non-Hazardous",
                hazardType: []
              },
              reproductiveToxicity: false,
              whmisHazards: false,
              sdsDescription: "",
              monographWarnings: ""
            })}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Ingredient
          </Button>
          
          {activeIngredients.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onActiveIngredientChange(activeIngredients.length - 1, "remove", null)}
              className="flex items-center text-red-600 hover:text-red-700"
            >
              <Minus className="w-4 h-4 mr-1" />
              Remove Last
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveIngredientsSection;
