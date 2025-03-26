
import React, { useState, useEffect } from "react";
import { AlertTriangle, AlertCircle, Shield, FileText, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveIngredient } from "../KeswickRiskAssessment";
import { HazardLevel } from "@/utils/nioshData";
import { getSdsData, SDSData } from "@/utils/mediscaAPI";
import SDSInfoSection from "./SDSInfoSection";

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
  // Track SDS data for each ingredient
  const [sdsData, setSdsData] = useState<Record<string, SDSData | null>>({});
  const [loadingSds, setLoadingSds] = useState<Record<string, boolean>>({});

  // Fetch SDS data when ingredients change
  useEffect(() => {
    const fetchSdsForIngredients = async () => {
      for (const ingredient of activeIngredients) {
        if (!sdsData[ingredient.name] && !loadingSds[ingredient.name]) {
          // Mark as loading
          setLoadingSds(prev => ({ ...prev, [ingredient.name]: true }));
          
          try {
            // Fetch SDS data for this ingredient
            const data = await getSdsData(ingredient.name);
            
            // Update SDS data state
            setSdsData(prev => ({ ...prev, [ingredient.name]: data }));
            
            // Update ingredient data based on SDS if editing is not in progress
            if (data && !isEditing) {
              const ingredientIndex = activeIngredients.findIndex(ing => ing.name === ingredient.name);
              if (ingredientIndex !== -1) {
                // Update WHMIS hazards based on SDS
                const hasWhmisHazard = data.hazardClassification.whmis.some(
                  hazard => !hazard.toLowerCase().includes("not classified")
                );
                
                if (hasWhmisHazard !== ingredient.whmisHazards) {
                  onActiveIngredientChange(ingredientIndex, "whmisHazards", hasWhmisHazard);
                }
                
                // Update SDS description
                const sdsDescription = data.exposureRisks.join("; ");
                if (sdsDescription && ingredient.sdsDescription !== sdsDescription) {
                  onActiveIngredientChange(ingredientIndex, "sdsDescription", sdsDescription);
                }
                
                // Check for reproductive toxicity
                const hasReproToxicity = data.hazardClassification.ghs.some(
                  hazard => hazard.toLowerCase().includes("reproductive")
                );
                
                if (hasReproToxicity !== ingredient.reproductiveToxicity) {
                  onActiveIngredientChange(ingredientIndex, "reproductiveToxicity", hasReproToxicity);
                }
              }
            }
          } catch (error) {
            console.error(`Error fetching SDS for ${ingredient.name}:`, error);
          } finally {
            // Mark as no longer loading
            setLoadingSds(prev => ({ ...prev, [ingredient.name]: false }));
          }
        }
      }
    };
    
    fetchSdsForIngredients();
  }, [activeIngredients]);

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
        <div key={index} className="mb-6 p-4 rounded-md shadow-sm border border-gray-200">
          <Tabs defaultValue="basic" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-pharmacy-darkBlue">Ingredient #{index + 1}</h4>
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="hazards">Hazard Info</TabsTrigger>
                <TabsTrigger value="sds">
                  SDS Data
                  {sdsData[ingredient.name] && (
                    <span className="ml-1 inline-flex h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="basic" className="mt-0">
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
              </div>
            </TabsContent>
            
            <TabsContent value="hazards" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-pharmacy-gray mb-1">SDS Description</label>
                  <Textarea
                    value={ingredient.sdsDescription}
                    onChange={(e) => onActiveIngredientChange(index, "sdsDescription", e.target.value)}
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-pharmacy-gray mb-1">Monograph Warnings</label>
                  <Textarea
                    value={ingredient.monographWarnings}
                    onChange={(e) => onActiveIngredientChange(index, "monographWarnings", e.target.value)}
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sds" className="mt-0">
              <SDSInfoSection 
                ingredientName={ingredient.name}
                sdsData={sdsData[ingredient.name]}
                isLoading={!!loadingSds[ingredient.name]}
                onViewSds={() => {
                  window.open(`https://www.medisca.com/Pages/ProductPages/SDSPages/${ingredient.name.toLowerCase().replace(/\s+/g, '-')}-sds.pdf`, '_blank');
                }}
              />
              
              {!loadingSds[ingredient.name] && !sdsData[ingredient.name] && (
                <div className="mt-4 flex justify-center">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      setLoadingSds(prev => ({ ...prev, [ingredient.name]: true }));
                      try {
                        const data = await getSdsData(ingredient.name);
                        setSdsData(prev => ({ ...prev, [ingredient.name]: data }));
                      } finally {
                        setLoadingSds(prev => ({ ...prev, [ingredient.name]: false }));
                      }
                    }}
                    className="text-xs"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    Manually Fetch SDS
                  </Button>
                </div>
              )}
              
              {!isEditing && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-700 flex items-start">
                  <Info className="w-4 h-4 mr-2 flex-shrink-0 text-blue-500" />
                  <p>
                    SDS information is automatically retrieved from Medisca's database. 
                    The information is used to update hazard classifications, PPE recommendations,
                    and risk assessment levels according to NAPRA guidelines.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      ))}
    </>
  );
};

export default ActiveIngredientsSection;
