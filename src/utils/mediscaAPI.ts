
/**
 * Medisca API Utilities
 * Provides functions for retrieving and parsing Safety Data Sheets (SDS)
 */

// Define SDS data structure
export interface SDSData {
  ingredientName: string;
  physicalForm?: string;
  hazardClassification: {
    ghs: string[];
    whmis: string[];
  };
  recommendedPPE: {
    gloves: string;
    respiratoryProtection: string;
    eyeProtection: string;
    bodyProtection: string;
  };
  exposureRisks: string[];
  handlingPrecautions: string[];
  timestamp: number;
}

// Cache for SDS data
const sdsCache: Record<string, SDSData> = {};

// Clear SDS cache for fresh data
export const clearSdsCache = (): void => {
  Object.keys(sdsCache).forEach(key => {
    delete sdsCache[key];
  });
  console.log("SDS cache cleared");
};

// Normalized SDS URL for Medisca
export const getMediscaSdsUrl = (ingredientName: string): string => {
  // Clean the ingredient name for URL use and ensure consistent casing
  const cleanName = ingredientName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  // Updated Medisca Public SDS URL format - using their direct SDS search path
  return `https://www.medisca.com/Pages/SdsSearch?product=${encodeURIComponent(ingredientName)}`;
};

// Function to open SDS document in new tab
export const openSdsDocument = (ingredientName: string): void => {
  try {
    const sdsUrl = getMediscaSdsUrl(ingredientName);
    console.log(`Opening SDS URL: ${sdsUrl}`);
    window.open(sdsUrl, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error(`Error opening SDS for ${ingredientName}:`, error);
    throw new Error(`Could not open SDS for ${ingredientName}`);
  }
};

// Get SDS data for an ingredient
export const getSdsData = async (ingredientName: string): Promise<SDSData | null> => {
  // Normalize the ingredient name
  const normalizedName = ingredientName.trim().toLowerCase();
  
  console.log(`Getting SDS data for ${normalizedName}...`);
  
  // Check if SDS data is already in cache
  if (sdsCache[normalizedName]) {
    console.log(`Using cached SDS data for ${normalizedName}`);
    return sdsCache[normalizedName];
  }
  
  try {
    // In a real implementation, this would call an API or parse a PDF
    // For demo purposes, we generate mock SDS data
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create mock SDS data based on ingredient name
    const sdsData = generateMockSdsData(normalizedName);
    
    // Cache the SDS data
    sdsCache[normalizedName] = sdsData;
    
    return sdsData;
  } catch (error) {
    console.error(`Error getting SDS data for ${normalizedName}:`, error);
    return null;
  }
};

// Generate mock SDS data for demo purposes
const generateMockSdsData = (ingredientName: string): SDSData => {
  // Base SDS data structure
  const baseData: SDSData = {
    ingredientName,
    hazardClassification: {
      ghs: ["Not classified as hazardous according to GHS"],
      whmis: ["Not classified as hazardous according to WHMIS"]
    },
    recommendedPPE: {
      gloves: "Nitrile gloves recommended",
      respiratoryProtection: "Not required under normal conditions",
      eyeProtection: "Safety glasses recommended",
      bodyProtection: "Lab coat recommended"
    },
    exposureRisks: ["No significant risks under normal handling conditions"],
    handlingPrecautions: [
      "Follow standard safe handling procedures",
      "Wash hands after handling"
    ],
    timestamp: Date.now()
  };
  
  // Customize SDS data based on ingredient
  const lowercaseName = ingredientName.toLowerCase();
  
  // Fix: Add omeprazole to the known ingredients
  if (lowercaseName.includes("ketoprofen")) {
    baseData.physicalForm = "White crystalline powder";
    baseData.hazardClassification.ghs = [
      "Eye Irritation Category 2",
      "Skin Irritation Category 2",
      "Specific Target Organ Toxicity - Single Exposure Category 3 (Respiratory)"
    ];
    baseData.hazardClassification.whmis = ["Health Hazard"];
    baseData.exposureRisks = [
      "May cause eye irritation",
      "May cause skin irritation",
      "May cause respiratory irritation"
    ];
  }
  else if (lowercaseName.includes("gabapentin")) {
    baseData.physicalForm = "White crystalline powder";
    baseData.hazardClassification.ghs = ["Not classified as hazardous according to GHS"];
    baseData.hazardClassification.whmis = ["Not classified as hazardous according to WHMIS"];
    baseData.exposureRisks = ["Minimal exposure risks under normal handling conditions"];
  }
  else if (lowercaseName.includes("ketamine")) {
    baseData.physicalForm = "White crystalline powder";
    baseData.hazardClassification.ghs = ["Acute Toxicity Category 4"];
    baseData.hazardClassification.whmis = ["Health Hazard", "Exclamation Mark"];
    baseData.exposureRisks = [
      "Harmful if swallowed", 
      "May cause drowsiness or dizziness",
      "Controlled substance requiring secure handling"
    ];
    baseData.recommendedPPE.respiratoryProtection = "Dust mask recommended when handling powder";
  }
  else if (lowercaseName.includes("baclofen")) {
    baseData.physicalForm = "White to off-white crystalline powder";
    baseData.hazardClassification.ghs = ["Acute Toxicity Category 4"];
    baseData.hazardClassification.whmis = ["Health Hazard"];
    baseData.exposureRisks = ["Harmful if swallowed", "May cause drowsiness"];
    baseData.recommendedPPE.respiratoryProtection = "Dust mask recommended when handling powder";
    // Fix: Clarify that baclofen is not a controlled substance/narcotic
    baseData.handlingPrecautions.push(
      "Not a controlled substance but requires appropriate handling"
    );
  }
  else if (lowercaseName.includes("clonidine")) {
    baseData.physicalForm = "White to off-white crystalline powder";
    baseData.hazardClassification.ghs = ["Acute Toxicity Category 3"];
    baseData.hazardClassification.whmis = ["Health Hazard"];
    baseData.exposureRisks = ["Toxic if swallowed", "May cause drowsiness"];
  }
  else if (lowercaseName.includes("lidocaine")) {
    baseData.physicalForm = "White crystalline powder";
    baseData.hazardClassification.ghs = ["Acute Toxicity Category 4"];
    baseData.hazardClassification.whmis = ["Health Hazard"];
    baseData.exposureRisks = ["Harmful if swallowed", "May cause skin irritation"];
  }
  else if (lowercaseName.includes("estradiol")) {
    baseData.physicalForm = "White to off-white crystalline powder";
    baseData.hazardClassification.ghs = [
      "Carcinogenicity Category 1B", 
      "Reproductive Toxicity Category 1A"
    ];
    baseData.hazardClassification.whmis = ["Health Hazard"];
    baseData.exposureRisks = [
      "May cause cancer", 
      "May damage fertility or the unborn child"
    ];
    baseData.handlingPrecautions.push(
      "Avoid exposure during pregnancy",
      "Use containment equipment when handling"
    );
  }
  else if (lowercaseName.includes("omeprazole")) {
    // Fix: Add proper data for Omeprazole
    baseData.physicalForm = "White to off-white powder";
    baseData.hazardClassification.ghs = ["Not classified as hazardous according to GHS"];
    baseData.hazardClassification.whmis = ["Not classified as hazardous according to WHMIS"];
    baseData.exposureRisks = ["Minimal exposure risks under normal handling conditions"];
    baseData.handlingPrecautions.push(
      "Store in tightly closed container",
      "Protect from light"
    );
  }
  // Handle cream and ointment base ingredients
  else if (lowercaseName.includes("cream base") || 
           lowercaseName.includes("ointment") || 
           lowercaseName.includes("emollient") || 
           lowercaseName.includes("lotion") ||
           lowercaseName.includes("creme")) {
    // Fix: Properly identify cream/ointment bases
    baseData.physicalForm = "Semi-solid cream/ointment";
    baseData.hazardClassification.ghs = ["Not classified as hazardous according to GHS"];
    baseData.hazardClassification.whmis = ["Not classified as hazardous according to WHMIS"];
    baseData.exposureRisks = ["Minimal exposure risks under normal handling conditions"];
    baseData.handlingPrecautions.push(
      "Store at controlled room temperature",
      "Protect from excessive heat"
    );
  }
  
  return baseData;
};

// Function to check if an ingredient is a powder based on SDS data
export const isPowderFormIngredient = (sdsData: SDSData | null): boolean => {
  if (!sdsData || !sdsData.physicalForm) return false;
  
  const powderKeywords = ["powder", "crystalline", "granular", "dust", "solid"];
  return powderKeywords.some(keyword => 
    sdsData.physicalForm!.toLowerCase().includes(keyword)
  );
};

// Function to check if an ingredient is a cream or ointment based on SDS data
export const isCreamOrOintment = (sdsData: SDSData | null): boolean => {
  if (!sdsData || !sdsData.physicalForm) return false;
  
  const creamKeywords = ["cream", "ointment", "semi-solid", "emollient", "lotion"];
  return creamKeywords.some(keyword => 
    sdsData.physicalForm!.toLowerCase().includes(keyword)
  );
};

// Function to check if an ingredient requires special ventilation based on SDS data
export const requiresSpecialVentilation = (sdsData: SDSData | null): boolean => {
  if (!sdsData) return false;
  
  // Check physical form for powder characteristics
  const isPowder = isPowderFormIngredient(sdsData);
  
  // Check hazard classification for respiratory concerns
  const hasRespiratoryHazard = sdsData.hazardClassification.ghs.some(hazard => 
    hazard.toLowerCase().includes("respiratory") || hazard.toLowerCase().includes("inhalation")
  );
  
  // Check exposure risks for inhalation concerns
  const hasInhalationRisk = sdsData.exposureRisks.some(risk => 
    risk.toLowerCase().includes("inhalation") || risk.toLowerCase().includes("respiratory")
  );
  
  return isPowder || hasRespiratoryHazard || hasInhalationRisk;
};
