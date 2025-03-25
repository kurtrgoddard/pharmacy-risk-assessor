
// NIOSH 2024 List of Hazardous Drugs in Healthcare Settings
// Publication No. 2025-103 (December 2024 edition)

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
  "ketoprofen": {
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
  // Convert drug name to lowercase for case-insensitive matching
  const normalizedName = drugName.toLowerCase().trim();
  
  // Check if the drug is explicitly marked as removed from hazardous list
  if (removedHazardousDrugs.some(drug => normalizedName.includes(drug.toLowerCase()))) {
    return {
      table: null,
      hazardType: [],
      requiresSpecialHandling: false
    };
  }
  
  // Look for exact match first
  if (nioshDrugDatabase[normalizedName]) {
    return nioshDrugDatabase[normalizedName];
  }
  
  // Look for partial matches (ingredient might be part of a longer name)
  for (const [key, value] of Object.entries(nioshDrugDatabase)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return value;
    }
  }
  
  // Return non-hazardous if no match found
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

// Get PPE recommendations based on hazard level
export const getPPERecommendations = (hazardLevel: HazardLevel) => {
  switch (hazardLevel) {
    case "High Hazard":
      return {
        gloves: "Chemotherapy",
        gown: "Disposable Hazardous Gown",
        mask: "N95",
        eyeProtection: true,
        otherPPE: ["Head covers", "Shoe covers"]
      };
    case "Moderate Hazard":
      return {
        gloves: "Double Regular",
        gown: "Designated Compounding Jacket",
        mask: "Surgical mask",
        eyeProtection: true,
        otherPPE: ["Hair covers"]
      };
    default:
      return {
        gloves: "Regular",
        gown: "Designated Compounding Jacket",
        mask: "Surgical mask",
        eyeProtection: false,
        otherPPE: []
      };
  }
};

// NAPRA Risk Assessment Decision Algorithm
// This algorithm determines NAPRA risk level based on multiple factors
export const determineNAPRARiskLevel = (assessmentData: any): NAPRARiskLevel => {
  // Check for hazardous ingredients (NIOSH Table 1 - automatic Level C)
  const hasTable1Hazards = assessmentData.activeIngredients.some(
    (ingredient: any) => ingredient.nioshStatus?.table === "Table 1"
  );
  
  if (hasTable1Hazards) {
    return "Level C";
  }
  
  // Check for reproductive toxicity or WHMIS hazards (Level B or C)
  const hasReproductiveToxicity = assessmentData.activeIngredients.some(
    (ingredient: any) => ingredient.reproductiveToxicity
  );
  
  const hasWHMISHazards = assessmentData.activeIngredients.some(
    (ingredient: any) => ingredient.whmisHazards
  );
  
  const hasTable2Hazards = assessmentData.activeIngredients.some(
    (ingredient: any) => ingredient.nioshStatus?.table === "Table 2"
  );
  
  if (hasReproductiveToxicity || (hasWHMISHazards && hasTable2Hazards)) {
    return "Level B";
  }
  
  // Check for complexity factors that may elevate to Level B
  const complexityFactors = [
    assessmentData.safetyChecks?.ventilationRequired,
    assessmentData.workflowConsiderations?.microbialContaminationRisk,
    assessmentData.workflowConsiderations?.crossContaminationRisk,
    assessmentData.safetyChecks?.specialEducation?.required,
    assessmentData.physicalCharacteristics?.includes("Powder")
  ];
  
  const complexityScore = complexityFactors.filter(Boolean).length;
  
  if (complexityScore >= 2 || hasWHMISHazards) {
    return "Level B";
  }
  
  // Default to Level A for simple compounds
  return "Level A";
};

// Generate rationale text based on NAPRA risk level assessment
export const generateNAPRARationale = (assessmentData: any, riskLevel: NAPRARiskLevel): string => {
  const hazardousIngredients = assessmentData.activeIngredients
    .filter((ingredient: any) => 
      ingredient.nioshStatus?.table === "Table 1" || 
      ingredient.nioshStatus?.table === "Table 2" ||
      ingredient.reproductiveToxicity ||
      ingredient.whmisHazards
    )
    .map((ingredient: any) => ingredient.name);
  
  switch (riskLevel) {
    case "Level C":
      return `This compound contains ${hazardousIngredients.join(", ")} which ${hazardousIngredients.length > 1 ? "are" : "is"} classified as NIOSH Table 1 hazardous drug${hazardousIngredients.length > 1 ? "s" : ""}. According to NAPRA guidelines, this requires Level C precautions including a containment primary engineering control, dedicated room with negative pressure, and full PPE.`;
    
    case "Level B":
      if (hazardousIngredients.length > 0) {
        return `This compound contains ${hazardousIngredients.join(", ")} which ${hazardousIngredients.length > 1 ? "have" : "has"} moderate hazard classifications. NAPRA guidelines require Level B precautions including proper ventilation, segregated compounding area, and appropriate PPE.`;
      } else {
        return `Based on the complexity factors (${assessmentData.physicalCharacteristics?.includes("Powder") ? "powder handling, " : ""}${assessmentData.safetyChecks?.ventilationRequired ? "ventilation requirements, " : ""}${assessmentData.workflowConsiderations?.microbialContaminationRisk ? "microbial contamination risk, " : ""}${assessmentData.workflowConsiderations?.crossContaminationRisk ? "cross-contamination risk, " : ""}${assessmentData.safetyChecks?.specialEducation?.required ? "special training required" : ""}), this compound requires Level B precautions according to NAPRA guidelines.`;
      }
    
    case "Level A":
      return "This compound consists of simple preparations with minimal risk factors. According to NAPRA guidelines, Level A precautions with standard operating procedures are sufficient for safe compounding.";
    
    default:
      return "Risk level rationale not available.";
  }
};
