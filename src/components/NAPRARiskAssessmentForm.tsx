
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { AlertTriangle, Check, HelpCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { KeswickAssessmentData } from "./KeswickRiskAssessment";

// Define the NAPRA risk assessment form data structure
interface NAPRARiskAssessment {
  // Basic preparation information
  preparationName: string;
  preparedBy: string;
  reviewedBy: string;
  dateAssessed: string;
  
  // Risk factors
  complexityFactors: {
    requiresCalculations: boolean;
    requiresSpecializedEquipment: boolean;
    requiresSpecializedKnowledge: boolean;
    multipleIngredients: boolean;
    difficultPreparationProcess: boolean;
  };
  
  hazardousFactors: {
    containsNIOSHIngredients: boolean;
    containsWHMISIngredients: boolean;
    reproductiveRisk: boolean;
    respiratoryRisk: boolean;
    contactSensitizer: boolean;
  };
  
  frequencyVolume: {
    frequencyOfPreparation: "daily" | "weekly" | "monthly" | "rarely";
    volumePreparation: "large" | "medium" | "small";
  };
  
  concentrationRisk: boolean;
  
  exposureRisk: {
    routesOfExposure: string[];
    exposureDuration: "prolonged" | "moderate" | "minimal";
  };
  
  crossContaminationRisk: boolean;
  microbialContaminationRisk: boolean;
  
  // Final assessment
  assignedRiskLevel: "A" | "B" | "C" | "";
  riskJustification: string;
  
  // Control measures
  recommendedControls: {
    engineeringControls: string[];
    administrativeControls: string[];
    ppe: string[];
    otherControls: string[];
  };
  
  // Safety equipment (added from previous changes)
  safetyEquipment?: {
    eyeWashStation: boolean;
    safetyShower: boolean;
    powderContainmentHood: boolean;
    localExhaustVentilation: boolean;
  };
}

// Default empty risk assessment
const defaultRiskAssessment: NAPRARiskAssessment = {
  preparationName: "",
  preparedBy: "",
  reviewedBy: "",
  dateAssessed: new Date().toISOString().split("T")[0],
  
  complexityFactors: {
    requiresCalculations: false,
    requiresSpecializedEquipment: false,
    requiresSpecializedKnowledge: false,
    multipleIngredients: false,
    difficultPreparationProcess: false
  },
  
  hazardousFactors: {
    containsNIOSHIngredients: false,
    containsWHMISIngredients: false,
    reproductiveRisk: false,
    respiratoryRisk: false,
    contactSensitizer: false
  },
  
  frequencyVolume: {
    frequencyOfPreparation: "rarely",
    volumePreparation: "small"
  },
  
  concentrationRisk: false,
  
  exposureRisk: {
    routesOfExposure: [],
    exposureDuration: "minimal"
  },
  
  crossContaminationRisk: false,
  microbialContaminationRisk: false,
  
  assignedRiskLevel: "",
  riskJustification: "",
  
  recommendedControls: {
    engineeringControls: [],
    administrativeControls: [],
    ppe: [],
    otherControls: []
  },
  
  safetyEquipment: {
    eyeWashStation: false,
    safetyShower: false,
    powderContainmentHood: false,
    localExhaustVentilation: false
  }
};

// Define props for the component
interface NAPRARiskAssessmentFormProps {
  initialData?: KeswickAssessmentData;
  onComplete: (assessment: NAPRARiskAssessment) => void;
  onCancel: () => void;
}

// Helper function to determine risk level based on assessment factors
const determineRiskLevel = (assessment: NAPRARiskAssessment): "A" | "B" | "C" => {
  // Check for Level C criteria first (highest risk)
  if (
    assessment.hazardousFactors.containsNIOSHIngredients && 
    (assessment.hazardousFactors.reproductiveRisk || 
     assessment.frequencyVolume.frequencyOfPreparation === "daily" ||
     assessment.frequencyVolume.volumePreparation === "large")
  ) {
    return "C";
  }
  
  // Check for Level B criteria
  if (
    assessment.hazardousFactors.containsWHMISIngredients ||
    assessment.hazardousFactors.reproductiveRisk ||
    assessment.hazardousFactors.respiratoryRisk ||
    assessment.concentrationRisk ||
    (assessment.complexityFactors.requiresSpecializedEquipment && 
     assessment.complexityFactors.requiresSpecializedKnowledge) ||
    assessment.microbialContaminationRisk ||
    (assessment.crossContaminationRisk && 
     assessment.frequencyVolume.frequencyOfPreparation !== "rarely")
  ) {
    return "B";
  }
  
  // Default to Level A (lowest risk)
  return "A";
};

// Define route of exposure options
const exposureRoutes = [
  "Inhalation",
  "Skin absorption",
  "Ingestion",
  "Eye contact",
  "Injection",
  "Mucous membrane contact"
];

// Define engineering controls options
const engineeringControls = [
  "Containment hood",
  "Biological safety cabinet",
  "Local exhaust ventilation",
  "Closed-system transfer device",
  "Automated compounding equipment",
  "Isolator"
];

// Define administrative controls options
const administrativeControls = [
  "Standard operating procedures (SOPs)",
  "Staff training and competency assessment",
  "Restricted access to compounding area",
  "Designated compounding times",
  "Signage and hazard communication",
  "Documentation and record-keeping",
  "Regular cleaning and decontamination procedures",
  "Waste management procedures"
];

// Define PPE options
const ppeOptions = [
  "Nitrile gloves",
  "Double gloves",
  "Chemotherapy gloves",
  "Non-permeable gown",
  "Chemotherapy gown",
  "Face mask",
  "N95 respirator",
  "Face shield",
  "Safety goggles",
  "Hair cover",
  "Shoe covers"
];

// Helper function to safely convert string to valid frequency
const mapToValidFrequency = (freq: string | undefined): "daily" | "weekly" | "monthly" | "rarely" => {
  if (freq?.toLowerCase().includes("daily")) return "daily";
  if (freq?.toLowerCase().includes("week")) return "weekly";
  if (freq?.toLowerCase().includes("month")) return "monthly";
  return "rarely";
};

const NAPRARiskAssessmentForm: React.FC<NAPRARiskAssessmentFormProps> = ({
  initialData,
  onComplete,
  onCancel
}) => {
  const [assessment, setAssessment] = useState<NAPRARiskAssessment>(defaultRiskAssessment);
  const [isGeneratingRiskLevel, setIsGeneratingRiskLevel] = useState(false);
  
  // Pre-populate form with initial data if provided
  useEffect(() => {
    if (initialData) {
      const frequencyPrep = mapToValidFrequency(initialData.preparationDetails?.frequency);
      
      // Create a type-safe prepopulated assessment
      const prepopulatedAssessment: NAPRARiskAssessment = {
        ...defaultRiskAssessment,
        preparationName: initialData.compoundName || "",
        
        complexityFactors: {
          requiresCalculations: defaultRiskAssessment.complexityFactors.requiresCalculations,
          requiresSpecializedEquipment: initialData.equipmentRequired.length > 0,
          requiresSpecializedKnowledge: initialData.safetyChecks?.specialEducation?.required || false,
          multipleIngredients: initialData.activeIngredients.length > 1,
          difficultPreparationProcess: defaultRiskAssessment.complexityFactors.difficultPreparationProcess
        },
        
        hazardousFactors: {
          containsNIOSHIngredients: initialData.activeIngredients.some(
            ingredient => ingredient.nioshStatus?.isOnNioshList || false
          ),
          containsWHMISIngredients: initialData.activeIngredients.some(
            ingredient => ingredient.whmisHazards || false
          ),
          reproductiveRisk: initialData.activeIngredients.some(
            ingredient => ingredient.reproductiveToxicity || false
          ),
          respiratoryRisk: initialData.activeIngredients.some(
            ingredient => 
              (ingredient.sdsDescription || "").toLowerCase().includes("respiratory") ||
              (ingredient.sdsDescription || "").toLowerCase().includes("inhalation")
          ),
          contactSensitizer: initialData.activeIngredients.some(
            ingredient => 
              (ingredient.sdsDescription || "").toLowerCase().includes("skin") ||
              (ingredient.sdsDescription || "").toLowerCase().includes("sensitizer")
          )
        },
        
        frequencyVolume: {
          frequencyOfPreparation: frequencyPrep,
          volumePreparation: "small" // Default to small, adjust based on quantity if available
        },
        
        concentrationRisk: initialData.preparationDetails?.concentrationRisk || false,
        
        exposureRisk: {
          routesOfExposure: initialData.exposureRisks || [],
          exposureDuration: "moderate" // Default to moderate
        },
        
        crossContaminationRisk: initialData.workflowConsiderations?.crossContaminationRisk || false,
        microbialContaminationRisk: initialData.workflowConsiderations?.microbialContaminationRisk || false,
        
        safetyEquipment: {
          eyeWashStation: initialData.safetyEquipment?.eyeWashStation || false,
          safetyShower: initialData.safetyEquipment?.safetyShower || false,
          powderContainmentHood: initialData.physicalCharacteristics.includes("Powder") && 
            (initialData.riskLevel === "Level B" || initialData.riskLevel === "Level C"),
          localExhaustVentilation: initialData.safetyEquipment?.localExhaustVentilation || false
        },

        // Set initial recommendations based on existing data
        recommendedControls: {
          engineeringControls: [],
          administrativeControls: [],
          ppe: [
            initialData.ppe?.gloves || "",
            initialData.ppe?.gown || "",
            initialData.ppe?.mask || "",
            ...(initialData.ppe?.eyeProtection ? ["Safety goggles"] : []),
            ...(initialData.ppe?.otherPPE || [])
          ].filter(item => item !== ""),
          otherControls: []
        },
        
        assignedRiskLevel: defaultRiskAssessment.assignedRiskLevel,
        riskJustification: defaultRiskAssessment.riskJustification,
        preparedBy: defaultRiskAssessment.preparedBy,
        reviewedBy: defaultRiskAssessment.reviewedBy,
        dateAssessed: defaultRiskAssessment.dateAssessed
      };
      
      setAssessment(prepopulatedAssessment);
    }
  }, [initialData]);
  
  // Handle form field changes
  const handleChange = (
    section: keyof NAPRARiskAssessment, 
    field: string, 
    value: any
  ) => {
    setAssessment(prev => {
      const sectionData = prev[section];
      if (typeof sectionData === 'object' && sectionData !== null) {
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [field]: value
          }
        };
      }
      // Handle primitive types
      return {
        ...prev,
        [section]: value
      };
    });
  };
  
  // Handle nested form field changes
  const handleNestedChange = (
    section: keyof NAPRARiskAssessment, 
    nestedSection: string,
    field: string, 
    value: any
  ) => {
    setAssessment(prev => {
      const sectionData = prev[section];
      if (typeof sectionData === 'object' && sectionData !== null) {
        const nestedData = sectionData[nestedSection];
        if (typeof nestedData === 'object' && nestedData !== null) {
          return {
            ...prev,
            [section]: {
              ...sectionData,
              [nestedSection]: {
                ...nestedData,
                [field]: value
              }
            }
          };
        }
      }
      return prev;
    });
  };
  
  // Handle checkbox list changes
  const handleCheckboxListChange = (
    section: keyof NAPRARiskAssessment,
    nestedSection: string,
    value: string, 
    checked: boolean
  ) => {
    setAssessment(prev => {
      const sectionData = prev[section];
      if (typeof sectionData === 'object' && sectionData !== null) {
        const listArray = sectionData[nestedSection];
        if (Array.isArray(listArray)) {
          const newArray = [...listArray];
          
          if (checked && !newArray.includes(value)) {
            newArray.push(value);
          } else if (!checked) {
            const index = newArray.indexOf(value);
            if (index !== -1) {
              newArray.splice(index, 1);
            }
          }
          
          return {
            ...prev,
            [section]: {
              ...sectionData,
              [nestedSection]: newArray
            }
          };
        }
      }
      return prev;
    });
  };
  
  // Generate risk level automatically
  const generateRiskLevel = () => {
    setIsGeneratingRiskLevel(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const riskLevel = determineRiskLevel(assessment);
      
      // Generate justification based on determined risk level
      let justification = "";
      
      if (riskLevel === "C") {
        justification = "Risk Level C assigned due to: \n";
        if (assessment.hazardousFactors.containsNIOSHIngredients) {
          justification += "- Contains ingredients listed on NIOSH hazardous drugs list\n";
        }
        if (assessment.hazardousFactors.reproductiveRisk) {
          justification += "- Contains ingredients with reproductive toxicity risks\n";
        }
        if (assessment.frequencyVolume.frequencyOfPreparation === "daily") {
          justification += "- Prepared daily, increasing cumulative exposure risk\n";
        }
        if (assessment.frequencyVolume.volumePreparation === "large") {
          justification += "- Large volumes prepared, increasing exposure risk\n";
        }
        justification += "\nLevel C requires comprehensive containment strategies including dedicated compounding room or C-PEC, extensive PPE, and comprehensive SOPs.";
      } else if (riskLevel === "B") {
        justification = "Risk Level B assigned due to: \n";
        if (assessment.hazardousFactors.containsWHMISIngredients) {
          justification += "- Contains ingredients with WHMIS health hazards\n";
        }
        if (assessment.hazardousFactors.respiratoryRisk) {
          justification += "- Respiratory sensitization or irritation risks present\n";
        }
        if (assessment.concentrationRisk) {
          justification += "- API concentration presents significant health risks\n";
        }
        if (assessment.complexityFactors.requiresSpecializedEquipment && assessment.complexityFactors.requiresSpecializedKnowledge) {
          justification += "- Requires specialized equipment and knowledge\n";
        }
        if (assessment.microbialContaminationRisk) {
          justification += "- Risk of microbial contamination\n";
        }
        if (assessment.crossContaminationRisk && assessment.frequencyVolume.frequencyOfPreparation !== "rarely") {
          justification += "- Cross-contamination risks with regular preparation\n";
        }
        justification += "\nLevel B requires a separate, well-ventilated compounding space, appropriate PPE, and specific SOPs.";
      } else {
        justification = "Risk Level A assigned due to: \n";
        justification += "- No significant hazardous characteristics identified\n";
        justification += "- Lower complexity of preparation\n";
        justification += "- Minimal risk to compounder and others\n";
        justification += "\nLevel A requires basic compounding procedures and can be prepared in a non-segregated compounding area.";
      }
      
      setAssessment(prev => ({
        ...prev,
        assignedRiskLevel: riskLevel,
        riskJustification: justification
      }));
      
      setIsGeneratingRiskLevel(false);
      toast.success(`Risk level ${riskLevel} determined`);
    }, 1000);
  };
  
  // Submit the assessment
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assessment.assignedRiskLevel) {
      toast.error("Please generate a risk level before submitting");
      return;
    }
    
    if (!assessment.preparationName) {
      toast.error("Please enter a preparation name");
      return;
    }
    
    onComplete(assessment);
    toast.success("NAPRA risk assessment completed");
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>NAPRA Non-Sterile Compounding Risk Assessment</CardTitle>
          <CardDescription>
            Assess the risk level (A, B, or C) in accordance with NAPRA guidelines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preparation-name">Preparation Name</Label>
              <Input 
                id="preparation-name"
                value={assessment.preparationName} 
                onChange={(e) => handleChange("preparationName", "", e.target.value)}
                placeholder="Enter preparation name"
              />
            </div>
            <div>
              <Label htmlFor="date-assessed">Date of Assessment</Label>
              <Input 
                id="date-assessed"
                type="date"
                value={assessment.dateAssessed} 
                onChange={(e) => handleChange("dateAssessed", "", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="prepared-by">Prepared By</Label>
              <Input 
                id="prepared-by"
                value={assessment.preparedBy} 
                onChange={(e) => handleChange("preparedBy", "", e.target.value)}
                placeholder="Name of preparer"
              />
            </div>
            <div>
              <Label htmlFor="reviewed-by">Reviewed By</Label>
              <Input 
                id="reviewed-by"
                value={assessment.reviewedBy} 
                onChange={(e) => handleChange("reviewedBy", "", e.target.value)}
                placeholder="Name of reviewer"
              />
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {/* Complexity factors */}
            <AccordionItem value="complexity">
              <AccordionTrigger className="text-md font-medium">
                Preparation Complexity Factors
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="requires-calculations"
                      checked={assessment.complexityFactors.requiresCalculations}
                      onCheckedChange={(checked) => handleNestedChange(
                        "complexityFactors", "", "requiresCalculations", !!checked
                      )}
                    />
                    <Label htmlFor="requires-calculations">
                      Requires complex calculations or measurements
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="requires-specialized-equipment"
                      checked={assessment.complexityFactors.requiresSpecializedEquipment}
                      onCheckedChange={(checked) => handleNestedChange(
                        "complexityFactors", "", "requiresSpecializedEquipment", !!checked
                      )}
                    />
                    <Label htmlFor="requires-specialized-equipment">
                      Requires specialized equipment
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="requires-specialized-knowledge"
                      checked={assessment.complexityFactors.requiresSpecializedKnowledge}
                      onCheckedChange={(checked) => handleNestedChange(
                        "complexityFactors", "", "requiresSpecializedKnowledge", !!checked
                      )}
                    />
                    <Label htmlFor="requires-specialized-knowledge">
                      Requires specialized knowledge or training
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="multiple-ingredients"
                      checked={assessment.complexityFactors.multipleIngredients}
                      onCheckedChange={(checked) => handleNestedChange(
                        "complexityFactors", "", "multipleIngredients", !!checked
                      )}
                    />
                    <Label htmlFor="multiple-ingredients">
                      Contains multiple ingredients
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="difficult-preparation-process"
                      checked={assessment.complexityFactors.difficultPreparationProcess}
                      onCheckedChange={(checked) => handleNestedChange(
                        "complexityFactors", "", "difficultPreparationProcess", !!checked
                      )}
                    />
                    <Label htmlFor="difficult-preparation-process">
                      Difficult preparation process
                    </Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Hazardous factors */}
            <AccordionItem value="hazardous">
              <AccordionTrigger className="text-md font-medium">
                Hazardous Characteristics
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="contains-niosh"
                      checked={assessment.hazardousFactors.containsNIOSHIngredients}
                      onCheckedChange={(checked) => handleNestedChange(
                        "hazardousFactors", "", "containsNIOSHIngredients", !!checked
                      )}
                    />
                    <Label htmlFor="contains-niosh" className="flex items-center">
                      Contains ingredients listed on NIOSH hazardous drugs list
                      {assessment.hazardousFactors.containsNIOSHIngredients && (
                        <AlertTriangle className="h-4 w-4 ml-2 text-red-500" />
                      )}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="contains-whmis"
                      checked={assessment.hazardousFactors.containsWHMISIngredients}
                      onCheckedChange={(checked) => handleNestedChange(
                        "hazardousFactors", "", "containsWHMISIngredients", !!checked
                      )}
                    />
                    <Label htmlFor="contains-whmis">
                      Contains ingredients with WHMIS health hazards
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="reproductive-risk"
                      checked={assessment.hazardousFactors.reproductiveRisk}
                      onCheckedChange={(checked) => handleNestedChange(
                        "hazardousFactors", "", "reproductiveRisk", !!checked
                      )}
                    />
                    <Label htmlFor="reproductive-risk" className="flex items-center">
                      Contains ingredients with reproductive toxicity risks
                      {assessment.hazardousFactors.reproductiveRisk && (
                        <AlertTriangle className="h-4 w-4 ml-2 text-red-500" />
                      )}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="respiratory-risk"
                      checked={assessment.hazardousFactors.respiratoryRisk}
                      onCheckedChange={(checked) => handleNestedChange(
                        "hazardousFactors", "", "respiratoryRisk", !!checked
                      )}
                    />
                    <Label htmlFor="respiratory-risk">
                      Contains respiratory sensitizers or irritants
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="contact-sensitizer"
                      checked={assessment.hazardousFactors.contactSensitizer}
                      onCheckedChange={(checked) => handleNestedChange(
                        "hazardousFactors", "", "contactSensitizer", !!checked
                      )}
                    />
                    <Label htmlFor="contact-sensitizer">
                      Contains skin sensitizers or irritants
                    </Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Frequency and volume */}
            <AccordionItem value="frequency-volume">
              <AccordionTrigger className="text-md font-medium">
                Frequency and Volume
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="frequency">Frequency of Preparation</Label>
                    <RadioGroup 
                      value={assessment.frequencyVolume.frequencyOfPreparation}
                      onValueChange={(value) => handleNestedChange(
                        "frequencyVolume", "", "frequencyOfPreparation", value
                      )}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="daily" />
                        <Label htmlFor="daily">Daily</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly">Weekly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rarely" id="rarely" />
                        <Label htmlFor="rarely">Rarely</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="volume">Volume of Preparation</Label>
                    <RadioGroup 
                      value={assessment.frequencyVolume.volumePreparation}
                      onValueChange={(value) => handleNestedChange(
                        "frequencyVolume", "", "volumePreparation", value
                      )}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="large" id="large-volume" />
                        <Label htmlFor="large-volume">Large (&gt;100 units/week or &gt;1L/week)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium-volume" />
                        <Label htmlFor="medium-volume">Medium (25-100 units/week or 250mL-1L/week)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="small" id="small-volume" />
                        <Label htmlFor="small-volume">Small (&lt;25 units/week or &lt;250mL/week)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox 
                      id="concentration-risk"
                      checked={assessment.concentrationRisk}
                      onCheckedChange={(checked) => handleChange(
                        "concentrationRisk", "", !!checked
                      )}
                    />
                    <Label htmlFor="concentration-risk">
                      API concentration presents health risks
                    </Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Exposure risk */}
            <AccordionItem value="exposure-risk">
              <AccordionTrigger className="text-md font-medium">
                Exposure Risk
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label className="block mb-2">Routes of Exposure</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {exposureRoutes.map((route) => (
                        <div key={route} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`route-${route}`}
                            checked={assessment.exposureRisk.routesOfExposure.includes(route)}
                            onCheckedChange={(checked) => handleCheckboxListChange(
                              "exposureRisk", "routesOfExposure", route, !!checked
                            )}
                          />
                          <Label htmlFor={`route-${route}`}>{route}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="exposure-duration">Exposure Duration</Label>
                    <RadioGroup 
                      value={assessment.exposureRisk.exposureDuration}
                      onValueChange={(value) => handleNestedChange(
                        "exposureRisk", "", "exposureDuration", value
                      )}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="prolonged" id="prolonged" />
                        <Label htmlFor="prolonged">Prolonged (&gt;1 hour per preparation)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="moderate" />
                        <Label htmlFor="moderate">Moderate (15-60 minutes per preparation)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="minimal" id="minimal" />
                        <Label htmlFor="minimal">Minimal (&lt;15 minutes per preparation)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Contamination risks */}
            <AccordionItem value="contamination-risk">
              <AccordionTrigger className="text-md font-medium">
                Contamination Risks
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="cross-contamination"
                      checked={assessment.crossContaminationRisk}
                      onCheckedChange={(checked) => handleChange(
                        "crossContaminationRisk", "", !!checked
                      )}
                    />
                    <Label htmlFor="cross-contamination">
                      Risk of cross-contamination with other preparations
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="microbial-contamination"
                      checked={assessment.microbialContaminationRisk}
                      onCheckedChange={(checked) => handleChange(
                        "microbialContaminationRisk", "", !!checked
                      )}
                    />
                    <Label htmlFor="microbial-contamination">
                      Risk of microbial contamination
                    </Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Risk level and controls */}
            <AccordionItem value="risk-level">
              <AccordionTrigger className="text-md font-medium">
                Risk Level and Controls
                {assessment.assignedRiskLevel && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-sm ${
                    assessment.assignedRiskLevel === "A" ? "bg-green-100 text-green-800" :
                    assessment.assignedRiskLevel === "B" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    Level {assessment.assignedRiskLevel}
                  </span>
                )}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <Button 
                      type="button" 
                      onClick={generateRiskLevel}
                      disabled={isGeneratingRiskLevel}
                    >
                      {isGeneratingRiskLevel ? (
                        <>Analyzing...</>
                      ) : (
                        <>
                          <HelpCircle className="mr-2 h-4 w-4" />
                          Generate Risk Level
                        </>
                      )}
                    </Button>
                    
                    {assessment.assignedRiskLevel && (
                      <div className={`px-4 py-2 rounded ${
                        assessment.assignedRiskLevel === "A" ? "bg-green-100 text-green-800" :
                        assessment.assignedRiskLevel === "B" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        <div className="font-medium">Risk Level {assessment.assignedRiskLevel}</div>
                      </div>
                    )}
                  </div>
                  
                  {assessment.assignedRiskLevel && (
                    <div>
                      <Label htmlFor="justification">Rationale/Justification</Label>
                      <Textarea 
                        id="justification"
                        value={assessment.riskJustification}
                        onChange={(e) => handleChange("riskJustification", "", e.target.value)}
                        className="mt-2 h-32"
                      />
                    </div>
                  )}
                  
                  {assessment.assignedRiskLevel && (
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <h4 className="font-medium">Recommended Control Measures</h4>
                      
                      <div>
                        <Label className="block mb-2">Engineering Controls</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {engineeringControls.map((control) => (
                            <div key={control} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`eng-${control}`}
                                checked={assessment.recommendedControls.engineeringControls.includes(control)}
                                onCheckedChange={(checked) => handleCheckboxListChange(
                                  "recommendedControls", "engineeringControls", control, !!checked
                                )}
                              />
                              <Label htmlFor={`eng-${control}`}>{control}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="block mb-2">Administrative Controls</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {administrativeControls.map((control) => (
                            <div key={control} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`admin-${control}`}
                                checked={assessment.recommendedControls.administrativeControls.includes(control)}
                                onCheckedChange={(checked) => handleCheckboxListChange(
                                  "recommendedControls", "administrativeControls", control, !!checked
                                )}
                              />
                              <Label htmlFor={`admin-${control}`}>{control}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="block mb-2">Personal Protective Equipment (PPE)</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {ppeOptions.map((ppe) => (
                            <div key={ppe} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`ppe-${ppe}`}
                                checked={assessment.recommendedControls.ppe.includes(ppe)}
                                onCheckedChange={(checked) => handleCheckboxListChange(
                                  "recommendedControls", "ppe", ppe, !!checked
                                )}
                              />
                              <Label htmlFor={`ppe-${ppe}`}>{ppe}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="other-controls">Other Control Measures</Label>
                        <Textarea 
                          id="other-controls"
                          placeholder="Enter any additional control measures"
                          value={assessment.recommendedControls.otherControls.join("\n")}
                          onChange={(e) => handleChange(
                            "recommendedControls", 
                            "otherControls", 
                            e.target.value.split("\n").filter(line => line.trim() !== "")
                          )}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          {/* NAPRA guidelines information */}
          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">NAPRA Guidelines</h4>
                <p className="text-xs text-blue-800 mt-1">
                  <strong>Level A:</strong> Simple compounding with low risk, prepared in a non-segregated compounding area.<br />
                  <strong>Level B:</strong> Complex compounding or moderate hazard, requires segregated compounding area.<br />
                  <strong>Level C:</strong> Complex compounding with high hazard, requires dedicated room with appropriate C-PEC.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!assessment.assignedRiskLevel}>
            <Check className="mr-2 h-4 w-4" />
            Complete Assessment
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default NAPRARiskAssessmentForm;
