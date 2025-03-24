
import React, { useState } from "react";
import { AlertTriangle, Check, Edit, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface IngredientData {
  name: string;
  concentration?: string;
  amount?: string;
  nioshHazard?: string;
}

export interface ExtractedFormulaData {
  compoundName: string;
  activeIngredients: IngredientData[];
  inactiveIngredients: IngredientData[];
  beyondUseDate: string;
  storageInstructions: string;
  containerType: string;
  compoundingProcedure: string[];
  specialInstructions: string;
}

interface ExtractedDataReviewProps {
  extractedData: ExtractedFormulaData;
  onDataValidated: () => void;
  onDataUpdated: (updatedData: ExtractedFormulaData) => void;
}

const ExtractedDataReview: React.FC<ExtractedDataReviewProps> = ({
  extractedData,
  onDataValidated,
  onDataUpdated
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ExtractedFormulaData>(extractedData);
  
  const handleValidateData = () => {
    // In a real implementation, this would validate the data more thoroughly
    if (!formData.compoundName) {
      toast.error("Compound name is required");
      return;
    }
    
    if (formData.activeIngredients.length === 0) {
      toast.error("At least one active ingredient is required");
      return;
    }
    
    toast.success("Data validated successfully");
    onDataValidated();
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    setIsEditing(false);
    onDataUpdated(formData);
    toast.success("Data updated successfully");
  };
  
  const handleCancel = () => {
    setFormData(extractedData);
    setIsEditing(false);
  };
  
  const handleInputChange = (field: keyof ExtractedFormulaData, value: string | IngredientData[] | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleIngredientChange = (index: number, field: keyof IngredientData, value: string, isActive: boolean) => {
    const ingredientList = isActive ? [...formData.activeIngredients] : [...formData.inactiveIngredients];
    ingredientList[index] = {
      ...ingredientList[index],
      [field]: value
    };
    
    if (isActive) {
      handleInputChange('activeIngredients', ingredientList);
    } else {
      handleInputChange('inactiveIngredients', ingredientList);
    }
  };

  return (
    <div className="w-full glass-card p-6 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-pharmacy-darkBlue">Extracted Information</h3>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="flex items-center text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                className="flex items-center text-xs bg-pharmacy-blue hover:bg-pharmacy-darkBlue"
              >
                <Check className="w-4 h-4 mr-1" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex items-center text-xs"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleValidateData}
                className="flex items-center text-xs bg-pharmacy-blue hover:bg-pharmacy-darkBlue"
              >
                <Check className="w-4 h-4 mr-1" />
                Validate Data
              </Button>
            </>
          )}
        </div>
      </div>
      
      <p className="text-sm text-pharmacy-gray mb-4">
        Review the extracted information below and verify its accuracy. If needed, you can modify the information before generating the final documents.
      </p>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="compound-details">
          <AccordionTrigger className="text-md font-medium text-pharmacy-darkBlue">
            Compound Details
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium block text-pharmacy-darkBlue">Compound Name</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md text-sm"
                  value={formData.compoundName}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('compoundName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium block text-pharmacy-darkBlue">Beyond-Use Date (BUD)</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md text-sm"
                  value={formData.beyondUseDate}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('beyondUseDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium block text-pharmacy-darkBlue">Storage Instructions</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md text-sm"
                  value={formData.storageInstructions}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('storageInstructions', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium block text-pharmacy-darkBlue">Container Type</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md text-sm"
                  value={formData.containerType}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('containerType', e.target.value)}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="active-ingredients">
          <AccordionTrigger className="text-md font-medium text-pharmacy-darkBlue">
            Active Ingredients
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {formData.activeIngredients.map((ingredient, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center justify-between border-b pb-2">
                  <div className="flex-1 mr-2">
                    <label className="text-xs font-medium block text-pharmacy-gray mb-1">Ingredient Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded-md text-sm"
                      value={ingredient.name}
                      disabled={!isEditing}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value, true)}
                    />
                  </div>
                  <div className="flex-1 mr-2 mt-2 md:mt-0">
                    <label className="text-xs font-medium block text-pharmacy-gray mb-1">Concentration</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded-md text-sm"
                      value={ingredient.concentration || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleIngredientChange(index, 'concentration', e.target.value, true)}
                    />
                  </div>
                  <div className="flex-1 mt-2 md:mt-0">
                    <label className="text-xs font-medium block text-pharmacy-gray mb-1">NIOSH Hazard</label>
                    <div className="flex items-center">
                      <select
                        className="w-full p-2 border rounded-md text-sm"
                        value={ingredient.nioshHazard || 'Non-hazardous'}
                        disabled={!isEditing}
                        onChange={(e) => handleIngredientChange(index, 'nioshHazard', e.target.value, true)}
                      >
                        <option value="Non-hazardous">Non-hazardous</option>
                        <option value="Hazardous - Reproductive risk">Hazardous - Reproductive risk</option>
                        <option value="Hazardous - Carcinogenic">Hazardous - Carcinogenic</option>
                        <option value="Hazardous - Organ toxicity">Hazardous - Organ toxicity</option>
                      </select>
                      {ingredient.nioshHazard?.includes("Hazardous") && (
                        <AlertTriangle className="w-4 h-4 text-red-500 ml-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newIngredients = [...formData.activeIngredients, { name: '', concentration: '', nioshHazard: 'Non-hazardous' }];
                    handleInputChange('activeIngredients', newIngredients);
                  }}
                  className="mt-2 text-xs"
                >
                  Add Ingredient
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="inactive-ingredients">
          <AccordionTrigger className="text-md font-medium text-pharmacy-darkBlue">
            Inactive Ingredients
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {formData.inactiveIngredients.map((ingredient, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center justify-between border-b pb-2">
                  <div className="flex-1 mr-2">
                    <label className="text-xs font-medium block text-pharmacy-gray mb-1">Ingredient Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded-md text-sm"
                      value={ingredient.name}
                      disabled={!isEditing}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value, false)}
                    />
                  </div>
                  <div className="flex-1 mt-2 md:mt-0">
                    <label className="text-xs font-medium block text-pharmacy-gray mb-1">Amount</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded-md text-sm"
                      value={ingredient.amount || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleIngredientChange(index, 'amount', e.target.value, false)}
                    />
                  </div>
                </div>
              ))}
              
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newIngredients = [...formData.inactiveIngredients, { name: '', amount: '' }];
                    handleInputChange('inactiveIngredients', newIngredients);
                  }}
                  className="mt-2 text-xs"
                >
                  Add Ingredient
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="compounding-procedure">
          <AccordionTrigger className="text-md font-medium text-pharmacy-darkBlue">
            Compounding Procedure
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {formData.compoundingProcedure.map((step, index) => (
                <div key={index} className="flex items-start mb-2">
                  <span className="text-sm font-medium mr-2">{index + 1}.</span>
                  <input 
                    type="text" 
                    className="flex-1 p-2 border rounded-md text-sm"
                    value={step}
                    disabled={!isEditing}
                    onChange={(e) => {
                      const newProcedure = [...formData.compoundingProcedure];
                      newProcedure[index] = e.target.value;
                      handleInputChange('compoundingProcedure', newProcedure);
                    }}
                  />
                </div>
              ))}
              
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newProcedure = [...formData.compoundingProcedure, ''];
                    handleInputChange('compoundingProcedure', newProcedure);
                  }}
                  className="mt-2 text-xs"
                >
                  Add Step
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="special-instructions">
          <AccordionTrigger className="text-md font-medium text-pharmacy-darkBlue">
            Special Instructions
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <textarea 
                className="w-full p-2 border rounded-md text-sm min-h-[100px]"
                value={formData.specialInstructions}
                disabled={!isEditing}
                onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-pharmacy-darkBlue mb-1">NAPRA Compliance Information</h4>
            <p className="text-xs text-pharmacy-gray">
              The extracted data will be used to generate NAPRA-compliant risk assessment and master formula documents.
              Please ensure all information is accurate before proceeding.
            </p>
          </div>
        </div>
      </div>
      
      {formData.activeIngredients.some(ing => ing.nioshHazard?.includes("Hazardous")) && (
        <div className="mt-4 bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-1">Hazardous Ingredients Detected</h4>
              <p className="text-xs text-red-600">
                One or more active ingredients are classified as hazardous according to NIOSH. 
                Additional precautions will be included in the risk assessment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtractedDataReview;
