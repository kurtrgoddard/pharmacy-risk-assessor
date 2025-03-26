
import React, { useState, useEffect, useCallback } from "react";
import { AlertTriangle, Check, Edit, Info, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { KeswickAssessmentData } from "./KeswickRiskAssessment";
import { getNioshHazardInfo, getHazardLevel, getPPERecommendations, HazardLevel, determineNAPRARiskLevel, generateNAPRARationale } from "@/utils/nioshData";
import { Badge } from "@/components/ui/badge";

// Import component sections
import CompoundDetailsSection from "./review/CompoundDetailsSection";
import ActiveIngredientsSection from "./review/ActiveIngredientsSection";
import PreparationDetailsSection from "./review/PreparationDetailsSection";
import CheckboxListSection from "./review/CheckboxListSection";
import SafetyChecksSection from "./review/SafetyChecksSection";
import WorkflowConsiderationsSection from "./review/WorkflowConsiderationsSection";
import PPESection from "./review/PPESection";
import SafetyEquipmentSection from "./review/SafetyEquipmentSection";
import RiskLevelSection from "./review/RiskLevelSection";

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
  // Initialize state with the provided extracted data to ensure fresh data
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<KeswickAssessmentData>(extractedData);
  
  // Force update form data when extractedData changes (new upload)
  useEffect(() => {
    console.log("Received new extracted data:", extractedData);
    setFormData(extractedData);
    setIsEditing(false);
  }, [extractedData]);
  
  // Get list of ingredient names for dependency tracking
  const ingredientNames = useCallback(() => 
    formData.activeIngredients.map(i => i.name),
  [formData.activeIngredients]);
  
  // Auto-detect NIOSH hazard information when ingredients change
  useEffect(() => {
    if (!isEditing) {
      console.log("Analyzing ingredients for hazards:", ingredientNames());
      
      const updatedIngredients = formData.activeIngredients.map(ingredient => {
        // Get NIOSH hazard information for this ingredient
        const nioshInfo = getNioshHazardInfo(ingredient.name);
        const hazardLevel = getHazardLevel(nioshInfo);
        
        console.log(`Ingredient ${ingredient.name} - NIOSH info:`, nioshInfo, "Hazard level:", hazardLevel);
        
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
      
      console.log("Highest hazard level detected:", highestHazardLevel);
      
      // Get recommended PPE based on the highest hazard level
      const recommendedPPE = getPPERecommendations(highestHazardLevel);
      
      // Apply NAPRA risk assessment logic
      const updatedFormData = {
        ...formData,
        activeIngredients: updatedIngredients,
        ppe: highestHazardLevel !== "Non-Hazardous" ? recommendedPPE : formData.ppe
      };
      
      // Determine NAPRA risk level using the decision algorithm
      const napraRiskLevel = determineNAPRARiskLevel(updatedFormData) as any;
      
      // Generate rationale based on the determined risk level
      const napraRationale = generateNAPRARationale(updatedFormData, napraRiskLevel);
      
      console.log("NAPRA Risk Level:", napraRiskLevel, "Rationale:", napraRationale);
      
      // Update the form data with the NAPRA risk assessment
      setFormData({
        ...updatedFormData,
        riskLevel: napraRiskLevel,
        rationale: napraRationale
      });
    }
  }, [ingredientNames(), isEditing]);
  
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
    
    toast.success("Data validated successfully - NAPRA risk assessment completed");
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
  
  // Helper function to render a risk level badge
  const renderRiskLevelBadge = (riskLevel: string) => {
    let icon, color;
    
    switch(riskLevel) {
      case "Level A":
        icon = <ShieldCheck className="w-4 h-4 mr-1" />;
        color = "bg-green-100 text-green-800";
        break;
      case "Level B":
        icon = <ShieldAlert className="w-4 h-4 mr-1" />;
        color = "bg-yellow-100 text-yellow-800";
        break;
      case "Level C":
        icon = <ShieldAlert className="w-4 h-4 mr-1" />;
        color = "bg-red-100 text-red-800";
        break;
      default:
        icon = <Info className="w-4 h-4 mr-1" />;
        color = "bg-blue-100 text-blue-800";
    }
    
    return (
      <Badge className={`flex items-center ${color}`}>
        {icon} {riskLevel}
      </Badge>
    );
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

  // Define options for checkbox lists
  const physicalCharacteristicOptions = [
    "Volatile Liquid", "Liquid", "Semi-Solid", "Solid", "Powder", "Cream/Ointment"
  ];

  const equipmentOptions = [
    "Balance", "Capsule Machine", "Electric Mortar/Pestle", "Heat Gun", "Hot Plate", 
    "Lab Oven", "Lollipop Mold", "Ointment Mill", "Powder Containment Hood", "Rectal Rocket Equipment"
  ];

  const exposureRiskOptions = ["Skin", "Eye", "Inhalation", "Oral", "Other"];

  const otherPPEOptions = ["Head covers", "Hair covers", "Shoe covers"];

  return (
    <div className="w-full glass-card p-6 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-medium text-pharmacy-darkBlue">NAPRA Risk Assessment Data</h3>
          {formData.riskLevel && (
            <div className="ml-3">
              {renderRiskLevelBadge(formData.riskLevel)}
            </div>
          )}
        </div>
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
                Validate NAPRA Assessment
              </Button>
            </>
          )}
        </div>
      </div>
      
      <p className="text-sm text-pharmacy-gray mb-2">
        Review the extracted information and verify its accuracy before generating the NAPRA-compliant risk assessment document.
      </p>
      
      {!isEditing && formData.riskLevel && (
        <div className="mb-4 p-4 rounded-lg border bg-gray-50">
          <div className="flex items-start">
            {formData.riskLevel === "Level A" && <ShieldCheck className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />}
            {formData.riskLevel === "Level B" && <ShieldAlert className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" />}
            {formData.riskLevel === "Level C" && <ShieldAlert className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />}
            <div>
              <h4 className="text-sm font-medium text-pharmacy-darkBlue">NAPRA Risk Assessment: {formData.riskLevel}</h4>
              <p className="text-xs text-pharmacy-gray mt-1">{formData.rationale}</p>
            </div>
          </div>
        </div>
      )}
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="compound-details">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Compound Details</AccordionTrigger>
          <AccordionContent>
            <CompoundDetailsSection
              compoundName={formData.compoundName}
              din={formData.din}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="active-ingredients">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Active Ingredients</AccordionTrigger>
          <AccordionContent>
            <ActiveIngredientsSection
              activeIngredients={formData.activeIngredients}
              isEditing={isEditing}
              onActiveIngredientChange={handleActiveIngredientChange}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="preparation-details">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Preparation Details</AccordionTrigger>
          <AccordionContent>
            <PreparationDetailsSection
              preparationDetails={formData.preparationDetails}
              isEditing={isEditing}
              onNestedObjectChange={handleNestedObjectChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="physical-characteristics">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Physical Characteristics</AccordionTrigger>
          <AccordionContent>
            <CheckboxListSection
              title="Physical Characteristics"
              options={physicalCharacteristicOptions}
              selectedValues={formData.physicalCharacteristics}
              fieldName="physicalCharacteristics"
              isEditing={isEditing}
              onCheckboxListChange={handleCheckboxListChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="equipment-required">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Equipment Required</AccordionTrigger>
          <AccordionContent>
            <CheckboxListSection
              title="Equipment Required"
              options={equipmentOptions}
              selectedValues={formData.equipmentRequired}
              fieldName="equipmentRequired"
              isEditing={isEditing}
              onCheckboxListChange={handleCheckboxListChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="safety-checks">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Safety Checks</AccordionTrigger>
          <AccordionContent>
            <SafetyChecksSection
              safetyChecks={formData.safetyChecks}
              isEditing={isEditing}
              onNestedObjectChange={handleNestedObjectChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="workflow-considerations">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Workflow Considerations</AccordionTrigger>
          <AccordionContent>
            <WorkflowConsiderationsSection
              workflowConsiderations={formData.workflowConsiderations}
              isEditing={isEditing}
              onNestedObjectChange={handleNestedObjectChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="exposure-risks">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Exposure Risks</AccordionTrigger>
          <AccordionContent>
            <CheckboxListSection
              title="Exposure Risks"
              options={exposureRiskOptions}
              selectedValues={formData.exposureRisks}
              fieldName="exposureRisks"
              isEditing={isEditing}
              onCheckboxListChange={handleCheckboxListChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ppe">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Personal Protective Equipment (PPE)</AccordionTrigger>
          <AccordionContent>
            <PPESection
              ppe={formData.ppe}
              otherPPEOptions={otherPPEOptions}
              isEditing={isEditing}
              onPPEChange={handlePPEChange}
              onCheckboxListChange={handleCheckboxListChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="safety-equipment">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Safety Equipment</AccordionTrigger>
          <AccordionContent>
            <SafetyEquipmentSection
              safetyEquipment={formData.safetyEquipment}
              isEditing={isEditing}
              onNestedObjectChange={handleNestedObjectChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="risk-level">
          <AccordionTrigger className="font-medium text-pharmacy-darkBlue">Risk Level</AccordionTrigger>
          <AccordionContent>
            <RiskLevelSection
              riskLevel={formData.riskLevel}
              rationale={formData.rationale}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default KeswickDataReview;
