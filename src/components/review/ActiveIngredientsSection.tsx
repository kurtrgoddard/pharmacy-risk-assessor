
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, ShieldCheck, ShieldAlert, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SDSInfoSection from "./SDSInfoSection";
import { ActiveIngredient } from "../KeswickRiskAssessment"; // Import the shared interface
import { SDSData, openSdsDocument, getSdsData } from "@/utils/mediscaAPI";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface ActiveIngredientsSectionProps {
  activeIngredients: ActiveIngredient[];
  isEditing: boolean;
  onActiveIngredientChange: (index: number, field: string, value: any) => void;
}

const ActiveIngredientsSection: React.FC<ActiveIngredientsSectionProps> = ({
  activeIngredients,
  isEditing,
  onActiveIngredientChange,
}) => {
  const [sdsDataLoading, setSdsDataLoading] = useState<Record<string, boolean>>({});
  const [sdsData, setSdsData] = useState<Record<string, SDSData | null>>({});
  const [sdsError, setSdsError] = useState<Record<string, string | null>>({});
  
  // Load SDS data when component mounts or activeIngredients change
  useEffect(() => {
    activeIngredients.forEach((ingredient, index) => {
      if (ingredient.name && !sdsData[ingredient.name]) {
        loadSdsData(ingredient.name, index);
      }
    });
  }, [activeIngredients]);
  
  const loadSdsData = async (ingredientName: string, index: number) => {
    setSdsDataLoading(prev => ({ ...prev, [ingredientName]: true }));
    setSdsError(prev => ({ ...prev, [ingredientName]: null }));
    
    try {
      const data = await getSdsData(ingredientName);
      setSdsData(prev => ({ ...prev, [ingredientName]: data }));
      onActiveIngredientChange(index, "sdsData", data); // Update the SDS data in the parent component
    } catch (error: any) {
      console.error(`Error fetching SDS data for ${ingredientName}:`, error);
      setSdsError(prev => ({ ...prev, [ingredientName]: error.message || "Failed to load SDS data" }));
      setSdsData(prev => ({ ...prev, [ingredientName]: null }));
      toast.error(`Failed to load SDS data for ${ingredientName}`);
    } finally {
      setSdsDataLoading(prev => ({ ...prev, [ingredientName]: false }));
    }
  };
  
  const handleViewSds = async (ingredientName: string) => {
    try {
      openSdsDocument(ingredientName);
      console.log(`Opening SDS for ${ingredientName}`);
    } catch (error) {
      console.error(`Error opening SDS for ${ingredientName}:`, error);
      toast.error("Could not retrieve SDS at this time. Please try again later.");
    }
  };
  
  const addIngredient = () => {
    const newIngredient: ActiveIngredient = {
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
      monographWarnings: "",
      sdsData: null
    };
    
    onActiveIngredientChange(activeIngredients.length, "", newIngredient);
  };
  
  const removeIngredient = (index: number) => {
    const updatedIngredients = [...activeIngredients];
    updatedIngredients.splice(index, 1);
    
    // Directly update the activeIngredients array in the parent component
    // by calling onActiveIngredientChange with a special "remove" action
    onActiveIngredientChange(index, "remove", updatedIngredients);
  };
  
  return (
    <div>
      {activeIngredients.map((ingredient, index) => (
        <div key={index} className="mb-4 p-4 rounded-md border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-pharmacy-gray mb-1">
                Ingredient Name
              </label>
              <Input
                type="text"
                value={ingredient.name || ""}
                onChange={(e) => onActiveIngredientChange(index, "name", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter ingredient name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-pharmacy-gray mb-1">
                Manufacturer (Optional)
              </label>
              <Input
                type="text"
                value={ingredient.manufacturer || ""}
                onChange={(e) => onActiveIngredientChange(index, "manufacturer", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter manufacturer"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-pharmacy-gray mb-1">
                Reproductive Toxicity
              </label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={ingredient.reproductiveToxicity || false}
                  onCheckedChange={(checked) => onActiveIngredientChange(index, "reproductiveToxicity", !!checked)}
                  disabled={!isEditing}
                  id={`reproductive-toxicity-${index}`}
                />
                <label htmlFor={`reproductive-toxicity-${index}`} className="text-sm text-pharmacy-gray">
                  Present
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-pharmacy-gray mb-1">
                WHMIS Hazards
              </label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={ingredient.whmisHazards || false}
                  onCheckedChange={(checked) => onActiveIngredientChange(index, "whmisHazards", !!checked)}
                  disabled={!isEditing}
                  id={`whmis-hazards-${index}`}
                />
                <label htmlFor={`whmis-hazards-${index}`} className="text-sm text-pharmacy-gray">
                  Present
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <SDSInfoSection
              ingredientName={ingredient.name}
              sdsData={sdsData[ingredient.name] || null}
              isLoading={sdsDataLoading[ingredient.name] || false}
              onViewSds={() => handleViewSds(ingredient.name)}
            />
          </div>
          
          {isEditing && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeIngredient(index)}
              className="mt-4 text-xs"
            >
              <Minus className="w-4 h-4 mr-1" />
              Remove Ingredient
            </Button>
          )}
        </div>
      ))}
      
      {isEditing && (
        <Button
          variant="outline"
          size="sm"
          onClick={addIngredient}
          className="mt-4 text-xs"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Ingredient
        </Button>
      )}
    </div>
  );
};

export default ActiveIngredientsSection;
