
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert, ShieldCheck, Plus, AlertCircle, Info, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SDSInfoSection from "./SDSInfoSection";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

interface ActiveIngredient {
  name: string;
  manufacturer: string;
  nioshStatus: {
    isOnNioshList: boolean;
    table?: string;
    hazardLevel?: "High Hazard" | "Moderate Hazard" | "Non-Hazardous";
    hazardType?: string[];
  };
  reproductiveToxicity: boolean;
  whmisHazards: boolean;
  sdsDescription: string;
  monographWarnings: string;
  sdsData?: any; // To avoid typescript errors
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
  // State to track which SDS is loading
  const [loadingSds, setLoadingSds] = useState<{[key: string]: boolean}>({});
  
  const handleViewSds = (ingredientName: string) => {
    // Mark this ingredient as loading
    setLoadingSds(prev => ({...prev, [ingredientName]: true}));
    
    // Here we would typically fetch SDS data
    // For now, simulate a loading state
    setTimeout(() => {
      setLoadingSds(prev => ({...prev, [ingredientName]: false}));
      // You could update the SDS data here in a real implementation
    }, 1500);
    
    toast.info(`Opening SDS for ${ingredientName}`);
  };
  
  return (
    <div className="space-y-6">
      {activeIngredients.map((ingredient, index) => (
        <div key={index} className="border rounded-md p-4 bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-pharmacy-gray mb-1">Ingredient Name</label>
                  {isEditing ? (
                    <Input
                      value={ingredient.name}
                      onChange={(e) => onActiveIngredientChange(index, "name", e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <div className="flex items-center">
                      <span className="text-pharmacy-darkBlue font-medium">{ingredient.name}</span>
                      {ingredient.nioshStatus.isOnNioshList && (
                        <Badge className="ml-2 bg-red-100 text-red-800">NIOSH List</Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-pharmacy-gray mb-1">Manufacturer</label>
                  {isEditing ? (
                    <Input
                      value={ingredient.manufacturer || ""}
                      onChange={(e) => onActiveIngredientChange(index, "manufacturer", e.target.value)}
                      className="w-full"
                      placeholder="Enter manufacturer (optional)"
                    />
                  ) : (
                    <span className="text-pharmacy-gray">
                      {ingredient.manufacturer || "Not specified"}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-2 md:mt-0">
              {ingredient.nioshStatus.hazardLevel && (
                <Badge className={`
                  ${ingredient.nioshStatus.hazardLevel === "High Hazard" ? "bg-red-100 text-red-800" : 
                    ingredient.nioshStatus.hazardLevel === "Moderate Hazard" ? "bg-yellow-100 text-yellow-800" : 
                    "bg-green-100 text-green-800"}
                `}>
                  {ingredient.nioshStatus.hazardLevel === "High Hazard" ? (
                    <ShieldAlert className="w-3 h-3 mr-1" />
                  ) : ingredient.nioshStatus.hazardLevel === "Moderate Hazard" ? (
                    <AlertCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <ShieldCheck className="w-3 h-3 mr-1" />
                  )}
                  {ingredient.nioshStatus.hazardLevel}
                </Badge>
              )}
            </div>
          </div>
          
          {(ingredient.nioshStatus.isOnNioshList || ingredient.nioshStatus.table) && (
            <div className="mb-3 flex items-start p-3 bg-yellow-50 border border-yellow-100 rounded">
              <Info className="text-yellow-700 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  NIOSH Classification: {ingredient.nioshStatus.table || "Not on NIOSH list"}
                </p>
                {ingredient.nioshStatus.hazardType && ingredient.nioshStatus.hazardType.length > 0 && (
                  <p className="text-xs text-yellow-700 mt-1">
                    Hazard type: {ingredient.nioshStatus.hazardType.join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div>
              <div className="flex items-center mb-1">
                <label className="text-sm font-medium text-pharmacy-gray">Reproductive Toxicity</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="ml-2 cursor-help">
                        <Info className="h-4 w-4 text-blue-500" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">Indicates if this ingredient has known reproductive toxicity effects requiring special precautions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center">
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={ingredient.reproductiveToxicity}
                    onChange={(e) => onActiveIngredientChange(index, "reproductiveToxicity", e.target.checked)}
                    className="mr-2"
                  />
                ) : (
                  <Badge className={`${ingredient.reproductiveToxicity ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                    {ingredient.reproductiveToxicity ? "Yes" : "No"}
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-1">
                <label className="text-sm font-medium text-pharmacy-gray">WHMIS Hazards</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="ml-2 cursor-help">
                        <Info className="h-4 w-4 text-blue-500" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">Indicates if this ingredient has WHMIS hazard classifications</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center">
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={ingredient.whmisHazards}
                    onChange={(e) => onActiveIngredientChange(index, "whmisHazards", e.target.checked)}
                    className="mr-2"
                  />
                ) : (
                  <Badge className={`${ingredient.whmisHazards ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
                    {ingredient.whmisHazards ? "Yes" : "No"}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-pharmacy-gray mb-1">Safety Data Sheet Information</label>
            {ingredient.sdsDescription && (
              <p className="text-sm text-pharmacy-gray mb-2">{ingredient.sdsDescription}</p>
            )}
            
            <SDSInfoSection
              ingredientName={ingredient.name}
              sdsData={ingredient.sdsData}
              isLoading={loadingSds[ingredient.name] || false}
              onViewSds={() => handleViewSds(ingredient.name)}
            />
          </div>
          
          {ingredient.monographWarnings && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-pharmacy-gray mb-1">Monograph Warnings</label>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                <div className="flex items-start">
                  <FileText className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-blue-700">{ingredient.monographWarnings}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {isEditing && (
        <Button 
          variant="outline" 
          size="sm"
          className="mt-2 w-full border-dashed"
          onClick={() => {
            onActiveIngredientChange(activeIngredients.length, "new", {
              name: "",
              manufacturer: "",
              nioshStatus: {
                isOnNioshList: false,
                hazardLevel: "Non-Hazardous"
              },
              reproductiveToxicity: false,
              whmisHazards: false,
              sdsDescription: "",
              monographWarnings: ""
            });
          }}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Ingredient
        </Button>
      )}
    </div>
  );
};

export default ActiveIngredientsSection;
