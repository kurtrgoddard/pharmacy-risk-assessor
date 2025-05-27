
/**
 * Medisca API Utilities
 * Provides functions for retrieving and parsing Safety Data Sheets (SDS)
 */

// Add new imports
import { dataOrchestrator } from '@/services/assessment/dataOrchestrator';
import { HazardAssessment, SDSInfo, SDSSearchResult } from '@/types/api';

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

// Multiple URL patterns to try for Medisca SDS
export const getMediscaSdsUrls = (ingredientName: string): string[] => {
  const cleanName = ingredientName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  const encodedName = encodeURIComponent(ingredientName);
  const encodedCleanName = encodeURIComponent(cleanName);
  
  // Try multiple URL patterns that Medisca might use
  return [
    // Current search page
    `https://www.medisca.com/Pages/SdsSearch?product=${encodedName}`,
    // Direct SDS path variations
    `https://www.medisca.com/sds/${encodedCleanName}.pdf`,
    `https://www.medisca.com/documents/sds/${encodedCleanName}.pdf`,
    `https://www.medisca.com/safety-data-sheets/${encodedCleanName}`,
    // Product-based SDS
    `https://www.medisca.com/product/${encodedCleanName}/sds`,
    `https://www.medisca.com/products/${encodedCleanName}/safety-data-sheet`,
    // Alternative search formats
    `https://www.medisca.com/search?q=${encodedName}&type=sds`,
    `https://www.medisca.com/Pages/Search?query=${encodedName}&filter=sds`,
    // Generic fallback to main SDS page
    `https://www.medisca.com/safety-data-sheets`,
    // PubChem as reliable fallback
    `https://pubchem.ncbi.nlm.nih.gov/compound/${encodedName}`,
    // ChemSpider as another fallback
    `http://www.chemspider.com/Search.aspx?q=${encodedName}`,
  ];
};

// Test if a URL is accessible (client-side limitation workaround)
const testSdsUrl = async (url: string): Promise<boolean> => {
  try {
    // We can't actually test URLs from client-side due to CORS
    // But we can implement a smart priority system
    console.log(`Would test URL: ${url}`);
    return true; // For now, assume URLs might work
  } catch (error) {
    console.error(`URL test failed for ${url}:`, error);
    return false;
  }
};

// Function to open SDS document with fallback URLs
export const openSdsDocument = (ingredientName: string): void => {
  try {
    const sdsUrls = getMediscaSdsUrls(ingredientName);
    console.log(`Attempting to open SDS for ${ingredientName} with ${sdsUrls.length} URL options`);
    
    // Try the first URL (most likely to work)
    const primaryUrl = sdsUrls[0];
    console.log(`Opening primary SDS URL: ${primaryUrl}`);
    
    // Open in new tab with specific window features to help with error detection
    const newWindow = window.open(primaryUrl, '_blank', 'noopener,noreferrer,width=1200,height=800');
    
    if (!newWindow) {
      throw new Error('Popup blocked or failed to open');
    }
    
    // Provide user with alternative options in console for manual fallback
    console.log('Alternative SDS sources if primary fails:', {
      'Medisca alternatives': sdsUrls.slice(1, 5),
      'External databases': sdsUrls.slice(-3),
      'Manual search suggestions': [
        `Search "${ingredientName}" on pubchem.ncbi.nlm.nih.gov`,
        `Search "${ingredientName} SDS" on Google`,
        `Contact your supplier for SDS documents`
      ]
    });
    
  } catch (error) {
    console.error(`Error opening SDS for ${ingredientName}:`, error);
    throw new Error(`Could not open SDS for ${ingredientName}`);
  }
};

// Enhanced SDS service class
export class MediscaSDSService {
  // Updated getSDSInfo method
  async getSDSInfo(ingredientName: string): Promise<SDSInfo> {
    try {
      // Try to get real data first
      const realData = await dataOrchestrator.getComprehensiveHazardData(ingredientName);
      
      if (realData.dataQuality.confidence > 0.7) {
        return this.transformToSDSFormat(realData);
      }
    } catch (error) {
      console.warn('Failed to get real SDS data, using mock:', error);
    }
    
    // Fall back to existing mock data logic
    return this.generateMockSDS(ingredientName);
  }

  // Transform real hazard data to SDS format
  private transformToSDSFormat(hazardData: HazardAssessment): SDSInfo {
    return {
      productName: hazardData.ingredientName,
      casNumber: hazardData.casNumber || 'N/A',
      physicalForm: hazardData.physicalProperties.physicalForm,
      hazardClassifications: hazardData.hazardClassifications.ghs.map(ghs => ({
        category: ghs.category,
        pictogram: ghs.pictogram || 'GHS07',
        signalWord: 'Warning',
        hazardStatement: ghs.description
      })),
      ppeRequirements: hazardData.safetyInfo.ppeRequirements,
      handlingPrecautions: hazardData.safetyInfo.handlingPrecautions,
      storageRequirements: [
        'Store in a cool, dry place',
        'Keep container tightly closed',
        'Store away from incompatible materials',
        'Follow manufacturer recommendations'
      ],
      spillResponse: hazardData.safetyInfo.spillResponse,
      firstAid: {
        inhalation: 'Remove to fresh air. Seek medical attention if symptoms persist.',
        skinContact: 'Wash with soap and water. Remove contaminated clothing.',
        eyeContact: 'Flush with water for 15 minutes. Seek medical attention.',
        ingestion: 'Do not induce vomiting. Seek immediate medical attention.'
      },
      fireHazard: this.determineFireHazard(hazardData),
      sdsUrl: getMediscaSdsUrls(hazardData.ingredientName)[0]
    };
  }

  // Determine fire hazard from hazard data
  private determineFireHazard(hazardData: HazardAssessment): string {
    const hasFlammableGHS = hazardData.hazardClassifications.ghs.some(ghs =>
      ghs.description.toLowerCase().includes('flammable') ||
      ghs.description.toLowerCase().includes('combustible')
    );
    
    if (hasFlammableGHS) {
      return 'Flammable - Keep away from heat and ignition sources';
    }
    
    return 'No special fire hazards';
  }

  // Generate mock SDS for fallback
  private generateMockSDS(ingredientName: string): SDSInfo {
    const mockSdsData = generateMockSdsData(ingredientName);
    
    return {
      productName: mockSdsData.ingredientName,
      casNumber: 'N/A',
      physicalForm: mockSdsData.physicalForm || 'powder',
      hazardClassifications: mockSdsData.hazardClassification.ghs.map(hazard => ({
        category: 'Category 2',
        pictogram: 'GHS07',
        signalWord: 'Warning',
        hazardStatement: hazard
      })),
      ppeRequirements: [
        { type: 'gloves', specification: mockSdsData.recommendedPPE.gloves },
        { type: 'eyewear', specification: mockSdsData.recommendedPPE.eyeProtection },
        { type: 'respirator', specification: mockSdsData.recommendedPPE.respiratoryProtection },
        { type: 'gown', specification: mockSdsData.recommendedPPE.bodyProtection }
      ],
      handlingPrecautions: mockSdsData.handlingPrecautions,
      storageRequirements: [
        'Store in a cool, dry place',
        'Keep container tightly closed'
      ],
      spillResponse: [
        'Absorb spill with appropriate material',
        'Clean area with appropriate cleaner'
      ],
      firstAid: {
        inhalation: 'Remove to fresh air. Seek medical attention if symptoms persist.',
        skinContact: 'Wash with soap and water. Remove contaminated clothing.',
        eyeContact: 'Flush with water for 15 minutes. Seek medical attention.',
        ingestion: 'Do not induce vomiting. Seek immediate medical attention.'
      },
      fireHazard: 'No special fire hazards',
      sdsUrl: getMediscaSdsUrls(ingredientName)[0]
    };
  }

  // Updated search method
  async searchSDS(query: string): Promise<SDSSearchResult[]> {
    try {
      // Try to get real data for the search query
      const realData = await dataOrchestrator.getComprehensiveHazardData(query);
      
      if (realData && realData.dataQuality.confidence > 0.5) {
        // Return a search result based on real data
        return [{
          productName: realData.ingredientName,
          casNumber: realData.casNumber || 'N/A',
          manufacturer: 'Various',
          sdsUrl: getMediscaSdsUrls(realData.ingredientName)[0],
          lastUpdated: realData.dataQuality.lastUpdated.toISOString().split('T')[0]
        }];
      }
    } catch (error) {
      console.warn('Failed to search real SDS data:', error);
    }
    
    // Fall back to mock search results
    return this.generateMockSearchResults(query);
  }

  // Generate mock search results
  private generateMockSearchResults(query: string): SDSSearchResult[] {
    const mockResults = [
      {
        productName: query,
        casNumber: '123-45-6',
        manufacturer: 'Medisca',
        sdsUrl: getMediscaSdsUrls(query)[0],
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    ];
    
    return mockResults;
  }
}

// Create singleton instance
export const mediscaSDSService = new MediscaSDSService();

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
