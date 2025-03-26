// NIOSH 2024 List of Hazardous Drugs in Healthcare Settings
// Publication No. 2025-103 (December 2024 edition)

import { SDSData } from "./mediscaAPI";

export interface NioshDrugInfo {
  table: "Table 1" | "Table 2" | null;
  hazardType: string[];
  requiresSpecialHandling: boolean;
}

export type HazardLevel = "High Hazard" | "Moderate Hazard" | "Non-Hazardous";
export type NAPRARiskLevel = "Level A" | "Level B" | "Level C";

// Map drug names to their NIOSH classification data
export const nioshDrugDatabase: Record<string, NioshDrugInfo> = {
  // Table 1 - High Hazard Drugs (NIOSH Group 1)
  "azathioprine": {
    table: "Table 1",
    hazardType: ["Carcinogenic (IARC Group 1)"],
    requiresSpecialHandling: true
  },
  "cyclophosphamide": {
    table: "Table 1",
    hazardType: ["Carcinogenic (IARC Group 1)"],
    requiresSpecialHandling: true
  },
  "cisplatin": {
    table: "Table 1",
    hazardType: ["Carcinogenic (IARC Group 2A)"],
    requiresSpecialHandling: true
  },
  "estradiol": {
    table: "Table 1",
    hazardType: ["Reproductive toxicity", "Developmental hazard"],
    requiresSpecialHandling: true
  },
  "tamoxifen": {
    table: "Table 1",
    hazardType: ["Carcinogenic", "Reproductive toxicity"],
    requiresSpecialHandling: true
  },
  "methotrexate": {
    table: "Table 1",
    hazardType: ["Reproductive toxicity", "Developmental hazard"],
    requiresSpecialHandling: true
  },
  
  // Table 2 - Moderate/Specific Hazard Drugs
  "anastrozole": {
    table: "Table 2",
    hazardType: ["Reproductive hazard"],
    requiresSpecialHandling: false
  },
  "dutasteride": {
    table: "Table 2",
    hazardType: ["Reproductive hazard"],
    requiresSpecialHandling: false
  },
  "misoprostol": {
    table: "Table 2",
    hazardType: ["Reproductive hazard", "Developmental hazard"],
    requiresSpecialHandling: false
  },
  "finasteride": {
    table: "Table 2",
    hazardType: ["Reproductive hazard"],
    requiresSpecialHandling: false
  },
  "spironolactone": {
    table: "Table 2",
    hazardType: ["Endocrine disruption"],
    requiresSpecialHandling: false
  },
  
  // Non-hazardous drugs per NIOSH (explicitly set to ensure correct classification)
  "ketoprofen": {
    table: null,
    hazardType: [],
    requiresSpecialHandling: false
  },
  "gabapentin": {
    table: null,
    hazardType: [],
    requiresSpecialHandling: false
  },
  "ketamine": {
    table: null,
    hazardType: [],
    requiresSpecialHandling: false
  },
  "baclofen": {
    table: null,
    hazardType: [],
    requiresSpecialHandling: false
  },
  "clonidine": {
    table: null,
    hazardType: [],
    requiresSpecialHandling: false
  },
  "lidocaine": {
    table: null,
    hazardType: [],
    requiresSpecialHandling: false
  },
  "prilocaine": {
    table: null,
    hazardType: [],
    requiresSpecialHandling: false
  },
  "amitriptyline": {
    table: null,
    hazardType: [],
    requiresSpecialHandling: false
  },
  "diclofenac": {
    table: null,
    hazardType: [],
    requiresSpecialHandling: false
  }
};

// Drugs no longer considered hazardous
export const removedHazardousDrugs = [
  "BCG",
  "Risperidone",
  "Pertuzumab",
  "Paliperidone",
  "Liraglutide",
  "Telavancin"
];

// Helper function to look up drug hazard information
export const getNioshHazardInfo = (drugName: string): NioshDrugInfo => {
  // Clear any extra spaces and normalize to lowercase for case-insensitive matching
  const normalizedName = drugName.toLowerCase().trim();
  console.log(`Looking up NIOSH info for: "${normalizedName}"`);
  
  // Check if the drug is explicitly marked as removed from hazardous list
  if (removedHazardousDrugs.some(drug => normalizedName.includes(drug.toLowerCase()))) {
    console.log(`${normalizedName} is on the removed hazardous drugs list`);
    return {
      table: null,
      hazardType: [],
      requiresSpecialHandling: false
    };
  }
  
  // Look for exact match first
  if (nioshDrugDatabase[normalizedName]) {
    console.log(`Found exact match for ${normalizedName}`);
    return nioshDrugDatabase[normalizedName];
  }
  
  // Look for matches in the database keys
  for (const [key, value] of Object.entries(nioshDrugDatabase)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      console.log(`Found partial match: ${normalizedName} matches with ${key}`);
      return value;
    }
  }
  
  // If no match found, log this and return non-hazardous
  console.log(`No NIOSH match found for ${normalizedName}, classifying as non-hazardous`);
  return {
    table: null,
    hazardType: [],
    requiresSpecialHandling: false
  };
};

// Helper function to get hazard level based on NIOSH table
export const getHazardLevel = (drugInfo: NioshDrugInfo): HazardLevel => {
  if (drugInfo.table === "Table 1") {
    return "High Hazard";
  } else if (drugInfo.table === "Table 2") {
    return "Moderate Hazard";
  } else {
    return "Non-Hazardous";
  }
};

// Get hazard level based on SDS data
export const getHazardLevelFromSDS = (sdsData: SDSData | null): HazardLevel => {
  if (!sdsData) return "Non-Hazardous";
  
  // Check for high hazards in GHS classification
  const highHazardKeywords = [
    "carcinogen", "mutagen", "reproductive", "toxic to reproduction", 
    "genetic defects", "fertility damage", "teratogenic", "category 1"
  ];
  
  const hasHighHazard = sdsData.hazardClassification.ghs.some(
    hazard => highHazardKeywords.some(keyword => hazard.toLowerCase().includes(keyword))
  );
  
  if (hasHighHazard) {
    return "High Hazard";
  }
  
  // Check for moderate hazards
  const moderateHazardKeywords = [
    "irritation", "corrosion", "sensitizer", "toxic", "danger",
    "flammable", "oxidizer", "category 2", "category 3", "acute toxicity"
  ];
  
  const hasModerateHazard = sdsData.hazardClassification.ghs.some(
    hazard => moderateHazardKeywords.some(keyword => hazard.toLowerCase().includes(keyword))
  );
  
  if (hasModerateHazard) {
    return "Moderate Hazard";
  }
  
  // Check WHMIS classifications
  const hasWHMISHazard = sdsData.hazardClassification.whmis.some(
    hazard => !hazard.toLowerCase().includes("not classified")
  );
  
  if (hasWHMISHazard) {
    return "Moderate Hazard";
  }
  
  return "Non-Hazardous";
};

// Combined hazard assessment using both NIOSH and SDS data
export const getCombinedHazardLevel = (
  nioshInfo: NioshDrugInfo,
  sdsData: SDSData | null
): HazardLevel => {
  const nioshHazardLevel = getHazardLevel(nioshInfo);
  
  if (!sdsData) {
    return nioshHazardLevel;
  }
  
  const sdsHazardLevel = getHazardLevelFromSDS(sdsData);
  
  // Take the highest hazard level
  if (nioshHazardLevel === "High Hazard" || sdsHazardLevel === "High Hazard") {
    return "High Hazard";
  }
  
  if (nioshHazardLevel === "Moderate Hazard" || sdsHazardLevel === "Moderate Hazard") {
    return "Moderate Hazard";
  }
  
  return "Non-Hazardous";
};

// Check if an ingredient is in powder form based on SDS data
export const isPowderForm = (sdsData: SDSData | null): boolean => {
  if (!sdsData || !sdsData.physicalForm) return false;
  
  const powderKeywords = ["powder", "crystalline", "granular", "dust", "solid"];
  return powderKeywords.some(keyword => 
    sdsData.physicalForm!.toLowerCase().includes(keyword)
  );
};

// Get PPE recommendations based on hazard level
export const getPPERecommendations = (hazardLevel: HazardLevel, sdsData?: SDSData | null) => {
  // Start with default PPE based on hazard level
  let ppe = {
    gloves: "",
    gown: "",
    mask: "",
    eyeProtection: false,
    otherPPE: [] as string[]
  };
  
  // Set basic PPE based on hazard level
  switch (hazardLevel) {
    case "High Hazard":
      ppe = {
        gloves: "Chemotherapy",
        gown: "Disposable Hazardous Gown",
        mask: "N95",
        eyeProtection: true,
        otherPPE: ["Head covers", "Shoe covers"]
      };
      break;
    case "Moderate Hazard":
      ppe = {
        gloves: "Double Regular",
        gown: "Designated Compounding Jacket",
        mask: "Surgical mask",
        eyeProtection: true,
        otherPPE: ["Hair covers"]
      };
      break;
    default:
      ppe = {
        gloves: "Regular",
        gown: "Designated Compounding Jacket",
        mask: "Surgical mask",
        eyeProtection: false,
        otherPPE: []
      };
  }
  
  // If SDS data is available, enhance recommendations
  if (sdsData) {
    // Use SDS glove recommendation if available
    if (sdsData.recommendedPPE.gloves && 
        !sdsData.recommendedPPE.gloves.toLowerCase().includes("not specified")) {
      ppe.gloves = sdsData.recommendedPPE.gloves;
    }
    
    // Use SDS respiratory recommendation if available
    if (sdsData.recommendedPPE.respiratoryProtection && 
        !sdsData.recommendedPPE.respiratoryProtection.toLowerCase().includes("not specified") &&
        !sdsData.recommendedPPE.respiratoryProtection.toLowerCase().includes("not required")) {
      ppe.mask = sdsData.recommendedPPE.respiratoryProtection;
    }
    
    // Ensure eye protection if recommended
    if (sdsData.recommendedPPE.eyeProtection && 
        !sdsData.recommendedPPE.eyeProtection.toLowerCase().includes("not specified") &&
        !sdsData.recommendedPPE.eyeProtection.toLowerCase().includes("not required")) {
      ppe.eyeProtection = true;
    }
  }
  
  return ppe;
};

// NAPRA Risk Assessment Decision Algorithm
// This algorithm determines NAPRA risk level based on multiple factors
export const determineNAPRARiskLevel = (assessmentData: any): NAPRARiskLevel => {
  console.log("Running NAPRA risk level assessment with data:", assessmentData);
  
  // Check for NIOSH Table 1 drugs - automatically Level C
  const hasTable1Hazards = assessmentData.activeIngredients.some(
    (ingredient: any) => ingredient.nioshStatus?.table === "Table 1"
  );
  
  if (hasTable1Hazards) {
    console.log("Level C assigned - Contains NIOSH Table 1 drug");
    return "Level C";
  }
  
  // Check for high hazard from SDS data
  const hasHighSdsHazard = assessmentData.activeIngredients.some(
    (ingredient: any) => {
      if (ingredient.sdsData) {
        const sdsHazardLevel = getHazardLevelFromSDS(ingredient.sdsData);
        return sdsHazardLevel === "High Hazard";
      }
      return false;
    }
  );
  
  if (hasHighSdsHazard) {
    console.log("Level C assigned - Contains ingredient with high hazard SDS classification");
    return "Level C";
  }
  
  // Check for reproductive toxicity - a key factor in Level C assignment
  const hasReproductiveToxicity = assessmentData.activeIngredients.some(
    (ingredient: any) => {
      // Check if ingredient is explicitly marked as having reproductive toxicity
      if (ingredient.reproductiveToxicity) return true;
      
      // Check if NIOSH data indicates reproductive toxicity
      if (ingredient.nioshStatus?.hazardType?.some(
        (type: string) => type.toLowerCase().includes("reproductive")
      )) {
        return true;
      }
      
      // Check SDS data for reproductive toxicity mentions
      if (ingredient.sdsData) {
        const reproKeywords = ["reproductive", "fertility", "teratogenic", "embryo", "fetus"];
        return ingredient.sdsData.hazardClassification.ghs.some(
          (hazard: string) => reproKeywords.some(keyword => hazard.toLowerCase().includes(keyword))
        );
      }
      
      return false;
    }
  );
  
  if (hasReproductiveToxicity) {
    console.log("Level C assigned - Contains ingredient with reproductive toxicity");
    return "Level C";
  }
  
  // Check for NIOSH Table 2 drugs - potential Level B
  const hasTable2Hazards = assessmentData.activeIngredients.some(
    (ingredient: any) => ingredient.nioshStatus?.table === "Table 2"
  );
  
  // Check for moderate hazard SDS data
  const hasModSdsHazard = assessmentData.activeIngredients.some(
    (ingredient: any) => {
      if (ingredient.sdsData) {
        const sdsHazardLevel = getHazardLevelFromSDS(ingredient.sdsData);
        return sdsHazardLevel === "Moderate Hazard";
      }
      return false;
    }
  );
  
  // Check for WHMIS hazards
  const hasWHMISHazards = assessmentData.activeIngredients.some(
    (ingredient: any) => ingredient.whmisHazards
  );
  
  // Check for multi-ingredient compound (more complex)
  const isMultiIngredient = assessmentData.activeIngredients.length > 1;
  
  // Assessment of powder hazard (key complexity factor)
  const isPowderFormulation = assessmentData.physicalCharacteristics.some(
    (char: string) => char.toLowerCase().includes("powder")
  );
  
  // Check if any ingredient is in powder form based on SDS data
  const hasIngredientInPowderForm = assessmentData.activeIngredients.some(
    (ingredient: any) => {
      if (ingredient.sdsData && ingredient.sdsData.physicalForm) {
        return isPowderForm(ingredient.sdsData);
      }
      return false;
    }
  );
  
  // Combined powder assessment
  const hasPowderRisk = isPowderFormulation || hasIngredientInPowderForm;
  
  console.log("Powder assessment:", {
    isPowderFormulation,
    hasIngredientInPowderForm,
    hasPowderRisk
  });
  
  // If has Table 2 drug or moderate SDS hazard AND is in powder form - escalate to Level C
  if ((hasTable2Hazards || hasModSdsHazard || hasWHMISHazards) && hasPowderRisk) {
    console.log("Level C assigned - Moderately hazardous drug in powder form");
    return "Level C";
  }
  
  // Level B assessment - based on hazard level and complexity factors
  if (hasTable2Hazards || hasModSdsHazard || hasWHMISHazards) {
    console.log("Level B assigned - Contains moderate hazard ingredient");
    return "Level B";
  }
  
  // Check additional complexity factors that may elevate to Level B
  const complexityFactors = [
    assessmentData.safetyChecks?.ventilationRequired,
    assessmentData.workflowConsiderations?.microbialContaminationRisk,
    assessmentData.workflowConsiderations?.crossContaminationRisk,
    assessmentData.safetyChecks?.specialEducation?.required,
    hasPowderRisk,
    assessmentData.preparationDetails?.concentrationRisk,
    isMultiIngredient  // Added multi-ingredient as a complexity factor
  ];
  
  const complexityScore = complexityFactors.filter(Boolean).length;
  console.log("Complexity assessment:", {
    complexityFactors,
    complexityScore
  });
  
  // If has multiple complexity factors or is in powder form, assign Level B
  if (complexityScore >= 2 || hasPowderRisk) {
    console.log("Level B assigned - Multiple complexity factors or powder form present");
    return "Level B";
  }
  
  // Default to Level A for simple compounds
  console.log("Level A assigned - Simple preparation with minimal risk factors");
  return "Level A";
};

// Generate rationale text based on NAPRA risk level assessment
export const generateNAPRARationale = (assessmentData: any, riskLevel: NAPRARiskLevel): string => {
  // Get hazardous ingredients
  const hazardousIngredients = assessmentData.activeIngredients
    .filter((ingredient: any) => 
      ingredient.nioshStatus?.table === "Table 1" || 
      ingredient.nioshStatus?.table === "Table 2" ||
      ingredient.reproductiveToxicity ||
      ingredient.whmisHazards ||
      (ingredient.sdsData && getHazardLevelFromSDS(ingredient.sdsData) !== "Non-Hazardous")
    )
    .map((ingredient: any) => ingredient.name);
  
  // Get complexity factors
  const isPowderFormulation = assessmentData.physicalCharacteristics.some(
    (char: string) => char.toLowerCase().includes("powder")
  );
  
  // Check if any ingredient is in powder form
  const hasIngredientInPowderForm = assessmentData.activeIngredients.some(
    (ingredient: any) => {
      if (ingredient.sdsData && ingredient.sdsData.physicalForm) {
        return isPowderForm(ingredient.sdsData);
      }
      return false;
    }
  );
  
  // Combined powder assessment
  const hasPowderRisk = isPowderFormulation || hasIngredientInPowderForm;
  
  // Check for multi-ingredient compound
  const isMultiIngredient = assessmentData.activeIngredients.length > 1;
  
  // Build the rationale based on risk level and factors
  switch (riskLevel) {
    case "Level C":
      // Check if Level C is due to NIOSH Table 1
      const hasTable1Drugs = assessmentData.activeIngredients.some(
        (ingredient: any) => ingredient.nioshStatus?.table === "Table 1"
      );
      
      if (hasTable1Drugs) {
        return `This compound contains ${hazardousIngredients.join(", ")} which ${hazardousIngredients.length > 1 ? "are" : "is"} classified as NIOSH Table 1 hazardous drug${hazardousIngredients.length > 1 ? "s" : ""}. According to NAPRA guidelines, this requires Level C precautions including a containment primary engineering control, dedicated room with negative pressure, and full PPE.`;
      }
      
      // Check if Level C is due to reproductive toxicity
      const hasReproToxicity = assessmentData.activeIngredients.some(
        (ingredient: any) => 
          ingredient.reproductiveToxicity ||
          ingredient.nioshStatus?.hazardType?.some(
            (type: string) => type.toLowerCase().includes("reproductive")
          )
      );
      
      if (hasReproToxicity) {
        return `This compound contains ingredient(s) with reproductive toxicity concerns. According to NAPRA guidelines, compounds with reproductive toxins require Level C precautions including containment primary engineering control and full PPE to prevent exposure risks.`;
      }
      
      // Check if Level C is due to powder form of hazardous drug
      if (isPowderFormulation && hazardousIngredients.length > 0) {
        return `This compound involves handling hazardous materials (${hazardousIngredients.join(", ")}) in powder form, which presents significant exposure risks. According to NAPRA guidelines, this combination requires Level C precautions including proper containment, ventilation controls, and full PPE.`;
      }
      
      return `Based on comprehensive hazard assessment, this compound requires Level C precautions due to significant risks associated with the ingredients and/or preparation process. This includes containment primary engineering control and full PPE according to NAPRA guidelines.`;
    
    case "Level B":
      if (hazardousIngredients.length > 0) {
        return `This compound contains ${hazardousIngredients.join(", ")} which ${hazardousIngredients.length > 1 ? "have" : "has"} moderate hazard classifications. NAPRA guidelines require Level B precautions including proper ventilation, segregated compounding area, and appropriate PPE.`;
      } else if (hasPowderRisk) {
        return `This compound involves handling ingredients in powder form, which presents potential exposure risks requiring additional precautions. According to NAPRA guidelines, powder formulations require Level B precautions including proper ventilation and appropriate PPE.`;
      } else if (isMultiIngredient) {
        return `This is a complex multi-ingredient preparation requiring additional handling precautions. According to NAPRA guidelines, these complexity factors necessitate Level B precautions including proper workspace setup and appropriate PPE.`;
      } else {
        // List specific complexity factors that led to Level B
        const factorsList = [];
        if (isPowderFormulation) factorsList.push("powder handling");
        if (assessmentData.safetyChecks?.ventilationRequired) factorsList.push("ventilation requirements");
        if (assessmentData.workflowConsiderations?.microbialContaminationRisk) factorsList.push("microbial contamination risk");
        if (assessmentData.workflowConsiderations?.crossContaminationRisk) factorsList.push("cross-contamination risk");
        if (assessmentData.safetyChecks?.specialEducation?.required) factorsList.push("special training required");
        if (assessmentData.preparationDetails?.concentrationRisk) factorsList.push("concentration sensitivity");
        
        return `Based on the complexity factors (${factorsList.join(", ")}), this compound requires Level B precautions according to NAPRA guidelines. This includes enhanced engineering controls, ventilation, and appropriate PPE.`;
      }
    
    case "Level A":
      return "This compound consists of simple preparations with minimal risk factors. According to NAPRA guidelines, Level A precautions with standard operating procedures are sufficient for safe compounding.";
    
    default:
      return "Risk level rationale not available.";
  }
};
