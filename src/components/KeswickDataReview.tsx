
import React, { useState, useEffect } from "react";
import { AlertTriangle, Check, Edit, Info, AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { KeswickAssessmentData } from "./KeswickRiskAssessment";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getNioshHazardInfo, getHazardLevel, getPPERecommendations, HazardLevel } from "@/utils/nioshData";

interface KeswickDataReviewProps {
  extractedData: KeswickAssessmentData;
  onDataValidated: () => void;
  onDataUpdated: (updatedData: KeswickAssessmentData) => void;
}

const KeswickDataReview: React.FC<KeswickDataReviewProps> = ({
  extractedData,
  onDataValidated,
  onDataUpdated
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<KeswickAssessmentData>(extractedData);
  
  // Auto-detect NIOSH hazard information on initial load and when ingredients change
  useEffect(() => {
    if (!isEditing) {
      const updatedIngredients = formData.activeIngredients.map(ingredient => {
        // Get NIOSH hazard information for this ingredient
        const nioshInfo = getNioshHazardInfo(ingredient.name);
        const hazardLevel = getHazardLevel(nioshInfo);
        
        // Update nioshStatus based on the lookup
        const updatedIngredient = {
          ...ingredient,
          nioshStatus: {
            ...ingredient.nioshStatus,
            isOnNioshList: nioshInfo.table !== null,
            table: nioshInfo.table || undefined,
            hazardLevel: hazardLevel,
            hazardType: nioshInfo.hazardType
          }
        };
        
        return updatedIngredient;
      });
      
      // Update the PPE recommendations if any high-hazard ingredients are detected
      const highestHazardLevel = updatedIngredients.reduce<HazardLevel>((highest, ingredient) => {
        const level = ingredient.nioshStatus.hazardLevel || "Non-Hazardous";
        if (level === "High Hazard") return "High Hazard";
        if (level === "Moderate Hazard" && highest !== "High Hazard") return "Moderate Hazard";
        return highest;
      }, "Non-Hazardous");
      
      // Get recommended PPE based on the highest hazard level
      const recommendedPPE = getPPERecommendations(highestHazardLevel);
      
      // Only auto-update PPE if there's a high or moderate hazard detected
      if (highestHazardLevel !== "Non-Hazardous") {
        setFormData(prev => ({
          ...prev,
          activeIngredients: updatedIngredients,
          ppe: recommendedPPE
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          activeIngredients: updatedIngredients
        }));
      }
    }
  }, [formData.activeIngredients.map(i => i.name).join(","), isEditing]);
  
  const handleValidateData = () => {
    // Basic validation
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
  
  // Fix for error TS2698: Spread types may only be created from object types
  const handleInputChange = (field: keyof KeswickAssessmentData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      newData[field] = value;
      return newData;
    });
  };
  
  const handleActiveIngredientChange = (index: number, field: string, value: any) => {
    const updatedIngredients = [...formData.activeIngredients];
    
    if (field === "nioshStatus.isOnNioshList" || field === "nioshStatus.table" || 
        field === "nioshStatus.hazardLevel" || field === "nioshStatus.hazardType") {
      // Handle nested object
      const [parent, child] = field.split('.');
      
      if (parent === "nioshStatus") {
        updatedIngredients[index] = {
          ...updatedIngredients[index],
          nioshStatus: {
            ...updatedIngredients[index].nioshStatus,
            [child]: value
          }
        };
      }
    } else {
      // Handle direct field
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [field]: value
      };
    }
    
    setFormData(prev => ({
      ...prev,
      activeIngredients: updatedIngredients
    }));
  };

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

  const physicalCharacteristicOptions = [
    "Volatile Liquid", "Liquid", "Semi-Solid", "Solid", "Powder", "Cream/Ointment"
  ];

  const equipmentOptions = [
    "Balance", "Capsule Machine", "Electric Mortar/Pestle", "Heat Gun", "Hot Plate", 
    "Lab Oven", "Lollipop Mold", "Ointment Mill", "Powder Containment Hood", "Rectal Rocket Equipment"
  ];

  const exposureRiskOptions = ["Skin", "Eye", "Inhalation", "Oral", "Other"];

  const otherPPEOptions = ["Head covers", "Hair covers", "Shoe covers"];

  const handleCheckboxListChange = (field: string, value: string, checked: boolean) => {
    let currentList: string[] = [];
    
    // Get the current field value based on the field path
    if (field === "physicalCharacteristics") {
      currentList = [...formData.physicalCharacteristics];
    } else if (field === "equipmentRequired") {
      currentList = [...formData.equipmentRequired];
    } else if (field === "exposureRisks") {
      currentList = [...formData.exposureRisks];
    } else if (field === "ppe.otherPPE") {
      currentList = [...formData.ppe.otherPPE];
    }
    
    // Update the list based on checkbox state
    if (checked) {
      if (!currentList.includes(value)) {
        currentList.push(value);
      }
    } else {
      currentList = currentList.filter(item => item !== value);
    }
    
    // Update the formData with the new list
    if (field === "physicalCharacteristics") {
      handleInputChange("physicalCharacteristics", currentList);
    } else if (field === "equipmentRequired") {
      handleInputChange("equipmentRequired", currentList);
    } else if (field === "exposureRisks") {
      handleInputChange("exposureRisks", currentList);
    } else if (field === "ppe.otherPPE") {
      setFormData(prev => ({
        ...prev,
        ppe: {
          ...prev.ppe,
          otherPPE: currentList
        }
      }));
    }
  };

  // Fix for error TS2537: Type 'KeswickAssessmentData' has no matching index signature
  const handleNestedObjectChange = (objectPath: string, field: string, value: any) => {
    const [parent, child] = objectPath.split('.');
    
    if (parent === "preparationDetails") {
      setFormData(prev => ({
        ...prev,
        preparationDetails: {
          ...prev.preparationDetails,
          [field]: value
        }
      }));
    } else if (parent === "safetyChecks") {
      setFormData(prev => ({
        ...prev,
        safetyChecks: {
          ...prev.safetyChecks,
          [field]: value
        }
      }));
    } else if (parent === "workflowConsiderations") {
      setFormData(prev => ({
        ...prev,
        workflowConsiderations: {
          ...prev.workflowConsiderations,
          [field]: value
        }
      }));
    } else if (parent === "safetyEquipment") {
      setFormData(prev => ({
        ...prev,
        safetyEquipment: {
          ...prev.safetyEquipment,
          [field]: value
        }
      }));
    }
  };

  const handlePPEChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      ppe: {
        ...prev.ppe,
        [field]: value
      }
    }));
  };

  return (
    <div className="w-full glass-card p-6 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-pharmacy-darkBlue">Keswick Risk Assessment Data</h3>
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
        Review the extracted information below and verify its accuracy before generating the final risk assessment document.
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
                <Input 
                  type="text" 
                  value={formData.compoundName}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('compoundName', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium block text-pharmacy-darkBlue">DIN (Drug Identification Number)</label>
                <Input 
                  type="text" 
                  value={formData.din}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('din', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="active-ingredients">
          <AccordionTrigger className="text-md font-medium text-pharmacy-darkBlue">
            Active Pharmaceutical Ingredients
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              {formData.activeIngredients.map((ingredient, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                      <div className="space-y-2">
                        <label className="text-sm font-medium block text-pharmacy-darkBlue">API Name</label>
                        <Input 
                          type="text" 
                          value={ingredient.name}
                          disabled={!isEditing}
                          onChange={(e) => handleActiveIngredientChange(index, 'name', e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium block text-pharmacy-darkBlue">Manufacturer</label>
                        <Input 
                          type="text" 
                          value={ingredient.manufacturer}
                          disabled={!isEditing}
                          onChange={(e) => handleActiveIngredientChange(index, 'manufacturer', e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="ml-4 min-w-[120px] flex items-center justify-end">
                      {getHazardBadge(ingredient.nioshStatus.hazardLevel)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`niosh-${index}`}
                          checked={ingredient.nioshStatus.isOnNioshList}
                          disabled={!isEditing}
                          onCheckedChange={(checked) => 
                            handleActiveIngredientChange(index, 'nioshStatus.isOnNioshList', !!checked)
                          }
                        />
                        <label 
                          htmlFor={`niosh-${index}`}
                          className="text-sm font-medium text-pharmacy-darkBlue cursor-pointer"
                        >
                          On NIOSH Antineoplastic Drug List
                        </label>
                      </div>
                      
                      {ingredient.nioshStatus.isOnNioshList && (
                        <div className="mt-2">
                          <label className="text-sm font-medium block text-pharmacy-darkBlue">NIOSH Table</label>
                          <select
                            value={ingredient.nioshStatus.table || ""}
                            disabled={!isEditing}
                            onChange={(e) => handleActiveIngredientChange(index, 'nioshStatus.table', e.target.value)}
                            className="w-full p-2 border rounded-md text-sm"
                          >
                            <option value="">Select Table</option>
                            <option value="Table 1">Table 1</option>
                            <option value="Table 2">Table 2</option>
                          </select>
                        </div>
                      )}
                      
                      {ingredient.nioshStatus.isOnNioshList && ingredient.nioshStatus.hazardType && (
                        <div className="mt-2">
                          <label className="text-sm font-medium block text-pharmacy-darkBlue">Hazard Type</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {ingredient.nioshStatus.hazardType.map((hazard, idx) => (
                              <Badge key={idx} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                {hazard}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`repro-tox-${index}`}
                          checked={ingredient.reproductiveToxicity}
                          disabled={!isEditing}
                          onCheckedChange={(checked) => 
                            handleActiveIngredientChange(index, 'reproductiveToxicity', !!checked)
                          }
                        />
                        <label 
                          htmlFor={`repro-tox-${index}`}
                          className="text-sm font-medium text-pharmacy-darkBlue cursor-pointer"
                        >
                          Toxic to reproduction
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`whmis-${index}`}
                        checked={ingredient.whmisHazards}
                        disabled={!isEditing}
                        onCheckedChange={(checked) => 
                          handleActiveIngredientChange(index, 'whmisHazards', !!checked)
                        }
                      />
                      <label 
                        htmlFor={`whmis-${index}`}
                        className="text-sm font-medium text-pharmacy-darkBlue cursor-pointer"
                      >
                        WHMIS Health Hazards
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <label className="text-sm font-medium block text-pharmacy-darkBlue">
                      SDS Section 2 Description (Hazards)
                    </label>
                    <Textarea 
                      value={ingredient.sdsDescription}
                      disabled={!isEditing}
                      onChange={(e) => handleActiveIngredientChange(index, 'sdsDescription', e.target.value)}
                      className="w-full min-h-[80px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium block text-pharmacy-darkBlue">
                      Product Monograph Contraindications/Warnings
                    </label>
                    <Textarea 
                      value={ingredient.monographWarnings}
                      disabled={!isEditing}
                      onChange={(e) => handleActiveIngredientChange(index, 'monographWarnings', e.target.value)}
                      className="w-full min-h-[80px]"
                    />
                  </div>
                  
                  {ingredient.nioshStatus.isOnNioshList && (
                    <div className="mt-4 bg-red-50 p-3 rounded-md border border-red-100">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-red-700 mb-1">NIOSH Hazardous Drug Alert</h4>
                          <p className="text-xs text-red-600">
                            This ingredient is listed on the NIOSH Hazardous Drugs List 
                            {ingredient.nioshStatus.table && ` (${ingredient.nioshStatus.table})`}.
                            {ingredient.nioshStatus.hazardLevel === "High Hazard" && " Enhanced safety precautions required."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isEditing && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const newIngredients = [...formData.activeIngredients, {
                      name: '',
                      manufacturer: '',
                      nioshStatus: {
                        isOnNioshList: false,
                        hazardLevel: "Non-Hazardous",
                        hazardType: []
                      },
                      reproductiveToxicity: false,
                      whmisHazards: false,
                      sdsDescription: '',
                      monographWarnings: ''
                    }];
                    handleInputChange('activeIngredients', newIngredients);
                  }}
                  className="mt-2"
                >
                  Add Ingredient
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="preparation-details">
          <AccordionTrigger className="text-md font-medium text-pharmacy-darkBlue">
            Preparation Details
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium block text-pharmacy-darkBlue">Frequency of Preparation</label>
                <select
                  value={formData.preparationDetails.frequency}
                  disabled={!isEditing}
                  onChange={(e) => handleNestedObjectChange('preparationDetails', 'frequency', e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Less">Less</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium block text-pharmacy-darkBlue">Quantity Prepared (Average)</label>
                <Input 
                  type="text" 
                  value={formData.preparationDetails.quantity}
                  disabled={!isEditing}
                  onChange={(e) => handleNestedObjectChange('preparationDetails', 'quantity', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 h-full pt-6">
                  <Checkbox 
                    id="concentration-risk"
                    checked={formData.preparationDetails.concentrationRisk}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => 
                      handleNestedObjectChange('preparationDetails', 'concentrationRisk', !!checked)
                    }
                  />
                  <label 
                    htmlFor="concentration-risk"
                    className="text-sm font-medium text-pharmacy-darkBlue cursor-pointer"
                  >
                    Concentration presents health risk
                  </label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="physical-characteristics">
          <AccordionTrigger className="text-md font-medium text-pharmacy-darkBlue">
            Physical Characteristics
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {physicalCharacteristicOptions.map((characteristic) => (
                <div key={characteristic} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`char-${characteristic}`}
                    checked={formData.physicalCharacteristics.includes(characteristic)}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => 
                      handleCheckboxListChange('physicalCharacteristics', characteristic, !!checked)
                    }
                  />
                  <label 
                    htmlFor={`char-${characteristic}`}
                    className="text-sm text-pharmacy-darkBlue cursor-pointer"
                  >
                    {characteristic}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="equipment-required">
          <AccordionTrigger className="text-md font-medium text-pharmacy-darkBlue">
            Special Compounding Equipment Required
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {equipmentOptions.map((equipment) => (
                <div key={equipment} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`equip-${equipment}`}
                    checked={formData.equipmentRequired.includes(equipment)}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => 
                      handleCheckboxListChange('equipmentRequired', equipment, !!checked)
                    }
                  />
                  <label 
                    htmlFor={`equip-${equipment}`}
                    className="text-sm text-pharmacy-darkBlue cursor-pointer"
                  >
                    {equipment}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="safety-checks">
          <AccordionTrigger className="text-md font-medium text-pharmacy-darkBlue">
            Additional Safety Checks
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="special-education"
                    checked={formData.safetyChecks.specialEducation.required}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        safetyChecks: {
                          ...prev.safetyChecks,
                          specialEducation: {
                            ...prev.safetyChecks.specialEducation,
                            required: !!checked
                          }
                        }
                      }));
                    }}
                  />
                  <label 
                    htmlFor="special-education"
                    className="text-sm font-medium text-pharmacy-darkBlue cursor-pointer"
                  >
                    Special education or competencies required
                  </label>
                </div>
                
                {formData.safetyChecks.specialEducation.required && (
                  <div className="mt-2 ml-6">
                    <label className="text-sm text-pharmacy-darkBlue block mb-1">Description</label>
                    <Input 
                      type="text" 
                      value={formData.safetyChecks.specialEducation.description || ''}
                      disabled={!isEditing}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          safetyChecks: {
                            ...prev.safetyChecks,
                            specialEducation: {
                              ...prev.safetyChecks.specialEducation,
                              description: e.target.value
                            }
                          }
                        }));
                      }}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="verification-required"
                    checked={formData.safetyChecks.verificationRequired}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        safetyChecks: {
                          ...prev.safetyChecks,
                          verificationRequired: !!checked
                        }
                      }));
                    }}
                  />
                  <label 
                    htmlFor="verification-required"
                    className="text-sm font-medium text-pharmacy-darkBlue cursor-pointer"
                  >
                    Visual verification required
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="equipment-available"
                    checked={formData.safetyChecks.equipmentAvailable}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        safetyChecks: {
                          ...prev.safetyChecks,
                          equipmentAvailable: !!checked
                        }
                      }));
                    }}
                  />
                  <label 
                    htmlFor="equipment-available"
                    className="text-sm font-medium text-pharmacy-darkBlue cursor-pointer"
                  >
                    Appropriate facilities/equipment available
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ventilation-required"
                    checked={formData.safetyChecks.ventilationRequired}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        safetyChecks: {
                          ...prev.safetyChecks,
                          ventilationRequired: !!checked
                        }
                      }));
                    }}
                  />
                  <label 
                    htmlFor="ventilation-required"
                    className="text-sm font-medium text-pharmacy-darkBlue cursor-pointer"
                  >
                    Ventilation required
                  </label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="workflow-considerations">
          <AccordionTrigger className="text-md font-medium text-pharmacy-darkBlue">
            Workflow Considerations
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="uninterrupted-workflow"
                    checked={formData.workflowConsiderations.uninterruptedWorkflow.status}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        workflowConsiderations: {
                          ...prev.workflowConsiderations,
                          uninterruptedWorkflow: {
                            ...prev.workflowConsiderations.uninterruptedWorkflow,
                            status: !!checked
                          }
                        }
                      }));
                    }}
                  />
                  <label 
                    htmlFor="uninterrupted-workflow"
                    className="text-sm font-medium text-pharmacy-darkBlue cursor-pointer"
                  >
                    Workflow uninterrupted
                  </label>
                </div>
                
                {!formData.workflowConsiderations.uninterruptedWorkflow.status && (
                  <div className="mt-2 ml-6">
                    <label className="text-sm text-pharmacy-darkBlue block mb-1">Measures</label>
                    <Input 
                      type="text" 
                      value={formData.workflowConsiderations.uninterruptedWorkflow.measures || ''}
                      disabled={!isEditing}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          workflowConsiderations: {
                            ...prev.workflowConsiderations,
                            uninterruptedWorkflow: {
                              ...prev.workflowConsiderations.uninterruptedWorkflow,
                              measures: e.target.value
                            }
                          }
                        }));
                      }}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="microbial-contamination"
                    checked={formData.workflowConsiderations.microbialContaminationRisk}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        workflowConsiderations: {
                          ...prev.workflowConsiderations,
                          microbialContaminationRisk: !!checked
                        }
                      }));
                    }}
                  />
                  <label 
                    htmlFor="microbial-contamination"
                    className="text-sm font-medium text-pharmacy-darkBlue cursor-pointer"
                  >
                    Risk of microbial contamination
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="cross-contamination"
                    checked={formData.workflowConsiderations.crossContaminationRisk}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        workflowConsiderations: {
                          ...prev.workflowConsiderations,
                          crossContaminationRisk: !!checked
                        }
                      }));
                    }}
                  />
                  <label 
                    htmlFor="cross-contamination"
                    className="text-sm font-medium text-pharmacy-darkBlue cursor-pointer"
                  >
                    Risk of cross-contamination
                  </label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="exposure-risks">
          <AccordionTrigger className="text-md font-medium text-pharmacy-darkBlue">
            Exposure Risks
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {exposureRiskOptions.map((risk) => (
                <div key={risk} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`risk-${risk}`}
                    checked={formData.exposureRisks.includes(risk)}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => 
                      handleCheckboxListChange('exposureRisks', risk, !!checked)
                    }
                  />
                  <label 
                    htmlFor={`risk-${risk}`}
                    className="text-sm text-pharmacy-darkBlue cursor-pointer"
                  >
                    {risk}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="ppe">
          <AccordionTrigger className="text-md font-medium text-pharmacy-darkBlue">
            Personal Protective Equipment (PPE)
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium block text-pharmacy-darkBlue">Gloves</label>
                  <select
                    value={formData.ppe.gloves}
                    disabled={!isEditing}
                    onChange={(e) => handlePPEChange('gloves', e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Chemotherapy">Chemotherapy</option>
                    <option value="Double Gloves">Double Gloves</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium block text-pharmacy-darkBlue">Gown</label>
                  <select
                    value={formData.ppe.gown}
                    disabled={!isEditing}
                    onChange={(e) => handlePPEChange('gown', e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="Designated Compounding Jacket">Designated Compounding Jacket</option>
                    <option value="Disposable Hazardous Gown">Disposable Hazardous Gown</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium block text-pharmacy-darkBlue">Mask</label>
                  <select
                    value={formData.ppe.mask}
                    disabled={!isEditing}
                    onChange={(e) => handlePPEChange('mask', e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="Surgical mask">Surgical mask</option>
                    <option value="N95">N95</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2 h-full pt-6">
                  <Checkbox 
                    id="eye-protection"
                    checked={formData.ppe.eyeProtection}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => handlePPEChange('eyeProtection', !!checked)}
                  />
                  <label 
                    htmlFor="eye-protection"
                    className="text-sm font-medium text-pharmacy-darkBlue cursor-pointer"
                  >
                    Eye Protection Required
                  </label>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium block text-pharmacy-darkBlue mb-2">Other PPE</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {otherPPEOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`ppe-${option}`}
                        checked={formData.ppe.otherPPE.includes(option)}
                        disabled={!isEditing}
                        onCheckedChange={(checked) => 
                          handleCheckboxListChange('ppe.otherPPE', option, !!checked)
                        }
                      />
                      <label 
                        htmlFor={`ppe-${option}`}
                        className="text-sm text-pharmacy-darkBlue cursor-pointer"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="safety-equipment">
          <AccordionTrigger className="text-md font-medium text-pharmacy-darkBlue">
            Safety Equipment Required
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="eye-wash"
                  checked={formData.safetyEquipment.eyeWashStation}
                  disabled={!isEditing}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({
                      ...prev,
                      safetyEquipment: {
                        ...prev.safetyEquipment,
                        eyeWashStation: !!checked
                      }
                    }));
                  }}
                />
                <label 
                  htmlFor="eye-wash"
                  className="text-sm font-medium text-pharmacy-darkBlue cursor-pointer"
                >
                  Eye wash station
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="safety-shower"
                  checked={formData.safetyEquipment.safetyShower}
                  disabled={!isEditing}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({
                      ...prev,
                      safetyEquipment: {
                        ...prev.safetyEquipment,
                        safetyShower: !!checked
                      }
                    }));
                  }}
                />
                <label 
                  htmlFor="safety-shower"
                  className="text-sm font-medium text-pharmacy-darkBlue cursor-pointer"
                >
                  Safety shower
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="risk-level">
          <AccordionTrigger className="text-md font-medium text-pharmacy-darkBlue">
            Risk Level & Rationale
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium block text-pharmacy-darkBlue">Risk Level Assigned</label>
                <select
                  value={formData.riskLevel}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('riskLevel', e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="Level A">Level A</option>
                  <option value="Level B">Level B</option>
                  <option value="Level C">Level C</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium block text-pharmacy-darkBlue">
                  Rationale for Risk Mitigation Measures
                </label>
                <Textarea 
                  value={formData.rationale}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('rationale', e.target.value)}
                  className="w-full min-h-[100px]"
                  placeholder="Briefly justify based on hazards, quantities, concentrations, PPE, and compounding frequency."
                />
              </div>
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
              This assessment follows the NAPRA Model Standards for Pharmacy Compounding of Non-sterile Preparations and USP {'\u003C'}795{'\u003E'}/{'\u003C'}800{'\u003E'} guidelines.
              Please ensure all information is accurate before generating the final document.
            </p>
          </div>
        </div>
      </div>
      
      {formData.activeIngredients.some(ing => ing.nioshStatus.isOnNioshList) && (
        <div className="mt-4 bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-1">Hazardous Ingredients Detected</h4>
              <p className="text-xs text-red-600">
                One or more active ingredients are classified as hazardous according to NIOSH. 
                Ensure appropriate safety measures are selected for this compound.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeswickDataReview;
