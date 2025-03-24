
// NIOSH 2024 List of Hazardous Drugs in Healthcare Settings
// Publication No. 2025-103 (December 2024 edition)

export interface NioshDrugInfo {
  table: "Table 1" | "Table 2" | null;
  hazardType: string[];
  requiresSpecialHandling: boolean;
}

export type HazardLevel = "High Hazard" | "Moderate Hazard" | "Non-Hazardous";

// Map drug names to their NIOSH classification data
export const nioshDrugDatabase: Record<string, NioshDrugInfo> = {
  // Table 1 - High Hazard Drugs
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
        gloves: "Regular",
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
