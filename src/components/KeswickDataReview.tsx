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
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Compound Details</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Compound Name</label>
                <Input
                  type="text"
                  value={formData.compoundName}
                  onChange={(e) => handleInputChange("compoundName", e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">DIN</label>
                <Input
                  type="text"
                  value={formData.din}
                  onChange={(e) => handleInputChange("din", e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="active-ingredients">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Active Ingredients</AccordionTrigger>
          <AccordionContent>
            {formData.activeIngredients.map((ingredient, index) => (
              <div key={index} className="mb-4 p-4 rounded-md shadow-sm border border-gray-200">
                <h4 className="text-sm font-medium text-pharmacy-darkBlue mb-2">Ingredient #{index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-pharmacy-gray mb-1">Name</label>
                    <Input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) => handleActiveIngredientChange(index, "name", e.target.value)}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pharmacy-gray mb-1">Manufacturer</label>
                    <Input
                      type="text"
                      value={ingredient.manufacturer}
                      onChange={(e) => handleActiveIngredientChange(index, "manufacturer", e.target.value)}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pharmacy-gray mb-1">NIOSH Listed</label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={ingredient.nioshStatus.isOnNioshList}
                        onCheckedChange={(checked) => handleActiveIngredientChange(index, "nioshStatus.isOnNioshList", !!checked)}
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
                          onChange={(e) => handleActiveIngredientChange(index, "nioshStatus.table", e.target.value)}
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
                        onCheckedChange={(checked) => handleActiveIngredientChange(index, "reproductiveToxicity", !!checked)}
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
                        onCheckedChange={(checked) => handleActiveIngredientChange(index, "whmisHazards", !!checked)}
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
                      onChange={(e) => handleActiveIngredientChange(index, "sdsDescription", e.target.value)}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pharmacy-gray mb-1">Monograph Warnings</label>
                    <Textarea
                      value={ingredient.monographWarnings}
                      onChange={(e) => handleActiveIngredientChange(index, "monographWarnings", e.target.value)}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="preparation-details">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Preparation Details</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Frequency of Preparation</label>
                <Input
                  type="text"
                  value={formData.preparationDetails.frequency}
                  onChange={(e) => handleNestedObjectChange("preparationDetails", "frequency", e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Quantity Prepared (Average)</label>
                <Input
                  type="text"
                  value={formData.preparationDetails.quantity}
                  onChange={(e) => handleNestedObjectChange("preparationDetails", "quantity", e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Concentration presents health risk</label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.preparationDetails.concentrationRisk}
                    onCheckedChange={(checked) => handleNestedObjectChange("preparationDetails", "concentrationRisk", !!checked)}
                    disabled={!isEditing}
                    id="concentration-risk"
                  />
                  <label htmlFor="concentration-risk" className="text-sm text-pharmacy-gray">
                    Presents Health Risk
                  </label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="physical-characteristics">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Physical Characteristics</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {physicalCharacteristicOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`physical-${option}`}
                    checked={formData.physicalCharacteristics.includes(option)}
                    onCheckedChange={(checked) => handleCheckboxListChange("physicalCharacteristics", option, checked)}
                    disabled={!isEditing}
                  />
                  <label htmlFor={`physical-${option}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="equipment-required">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Equipment Required</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipmentOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`equipment-${option}`}
                    checked={formData.equipmentRequired.includes(option)}
                    onCheckedChange={(checked) => handleCheckboxListChange("equipmentRequired", option, checked)}
                    disabled={!isEditing}
                  />
                  <label htmlFor={`equipment-${option}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="safety-checks">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Safety Checks</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Special education or competencies required</label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.safetyChecks.specialEducation.required}
                    onCheckedChange={(checked) => handleNestedObjectChange("safetyChecks", "specialEducation", { ...formData.safetyChecks.specialEducation, required: !!checked })}
                    disabled={!isEditing}
                    id="special-education-required"
                  />
                  <label htmlFor="special-education-required" className="text-sm text-pharmacy-gray">
                    Required
                  </label>
                </div>
                {formData.safetyChecks.specialEducation.required && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-pharmacy-gray mb-1">Description</label>
                    <Textarea
                      value={formData.safetyChecks.specialEducation.description || ""}
                      onChange={(e) => handleNestedObjectChange("safetyChecks", "specialEducation", { ...formData.safetyChecks.specialEducation, description: e.target.value })}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Visual verification required</label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.safetyChecks.verificationRequired}
                    onCheckedChange={(checked) => handleNestedObjectChange("safetyChecks", "verificationRequired", !!checked)}
                    disabled={!isEditing}
                    id="verification-required"
                  />
                  <label htmlFor="verification-required" className="text-sm text-pharmacy-gray">
                    Required
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Appropriate facilities/equipment available</label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.safetyChecks.equipmentAvailable}
                    onCheckedChange={(checked) => handleNestedObjectChange("safetyChecks", "equipmentAvailable", !!checked)}
                    disabled={!isEditing}
                    id="equipment-available"
                  />
                  <label htmlFor="equipment-available" className="text-sm text-pharmacy-gray">
                    Available
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Ventilation required</label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.safetyChecks.ventilationRequired}
                    onCheckedChange={(checked) => handleNestedObjectChange("safetyChecks", "ventilationRequired", !!checked)}
                    disabled={!isEditing}
                    id="ventilation-required"
                  />
                  <label htmlFor="ventilation-required" className="text-sm text-pharmacy-gray">
                    Required
                  </label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="workflow-considerations">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Workflow Considerations</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Workflow uninterrupted</label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.workflowConsiderations.uninterruptedWorkflow.status}
                    onCheckedChange={(checked) => handleNestedObjectChange("workflowConsiderations", "uninterruptedWorkflow", { ...formData.workflowConsiderations.uninterruptedWorkflow, status: !!checked })}
                    disabled={!isEditing}
                    id="workflow-uninterrupted"
                  />
                  <label htmlFor="workflow-uninterrupted" className="text-sm text-pharmacy-gray">
                    Uninterrupted
                  </label>
                </div>
                {!formData.workflowConsiderations.uninterruptedWorkflow.status && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-pharmacy-gray mb-1">Measures</label>
                    <Textarea
                      value={formData.workflowConsiderations.uninterruptedWorkflow.measures || ""}
                      onChange={(e) => handleNestedObjectChange("workflowConsiderations", "uninterruptedWorkflow", { ...formData.workflowConsiderations.uninterruptedWorkflow, measures: e.target.value })}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Risk of microbial contamination</label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.workflowConsiderations.microbialContaminationRisk}
                    onCheckedChange={(checked) => handleNestedObjectChange("workflowConsiderations", "microbialContaminationRisk", !!checked)}
                    disabled={!isEditing}
                    id="microbial-contamination-risk"
                  />
                  <label htmlFor="microbial-contamination-risk" className="text-sm text-pharmacy-gray">
                    Risk Present
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Risk of cross-contamination</label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.workflowConsiderations.crossContaminationRisk}
                    onCheckedChange={(checked) => handleNestedObjectChange("workflowConsiderations", "crossContaminationRisk", !!checked)}
                    disabled={!isEditing}
                    id="cross-contamination-risk"
                  />
                  <label htmlFor="cross-contamination-risk" className="text-sm text-pharmacy-gray">
                    Risk Present
                  </label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="exposure-risks">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Exposure Risks</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exposureRiskOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`exposure-${option}`}
                    checked={formData.exposureRisks.includes(option)}
                    onCheckedChange={(checked) => handleCheckboxListChange("exposureRisks", option, checked)}
                    disabled={!isEditing}
                  />
                  <label htmlFor={`exposure-${option}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ppe">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Personal Protective Equipment (PPE)</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Gloves</label>
                <Input
                  type="text"
                  value={formData.ppe.gloves}
                  onChange={(e) => handlePPEChange("gloves", e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Gown</label>
                <Input
                  type="text"
                  value={formData.ppe.gown}
                  onChange={(e) => handlePPEChange("gown", e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Mask</label>
                <Input
                  type="text"
                  value={formData.ppe.mask}
                  onChange={(e) => handlePPEChange("mask", e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Eye Protection Required</label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.ppe.eyeProtection}
                    onCheckedChange={(checked) => handlePPEChange("eyeProtection", !!checked)}
                    disabled={!isEditing}
                    id="eye-protection-required"
                  />
                  <label htmlFor="eye-protection-required" className="text-sm text-pharmacy-gray">
                    Required
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Other PPE</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otherPPEOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`ppe-${option}`}
                        checked={formData.ppe.otherPPE.includes(option)}
                        onCheckedChange={(checked) => handleCheckboxListChange("ppe.otherPPE", option, checked)}
                        disabled={!isEditing}
                      />
                      <label htmlFor={`ppe-${option}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Safety Equipment</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Eye wash station</label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.safetyEquipment.eyeWashStation}
                    onCheckedChange={(checked) => handleNestedObjectChange("safetyEquipment", "eyeWashStation", !!checked)}
                    disabled={!isEditing}
                    id="eye-wash-station"
                  />
                  <label htmlFor="eye-wash-station" className="text-sm text-pharmacy-gray">
                    Available
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Safety shower</label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.safetyEquipment.safetyShower}
                    onCheckedChange={(checked) => handleNestedObjectChange("safetyEquipment", "safetyShower", !!checked)}
                    disabled={!isEditing}
                    id="safety-shower"
                  />
                  <label htmlFor="safety-shower" className="text-sm text-pharmacy-gray">
                    Available
                  </label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="risk-level">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Risk Level</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Risk Level Assigned</label>
                <Input
                  type="text"
                  value={formData.riskLevel}
                  onChange={(e) => handleInputChange("riskLevel", e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pharmacy-gray mb-1">Rationale</label>
                <Textarea
