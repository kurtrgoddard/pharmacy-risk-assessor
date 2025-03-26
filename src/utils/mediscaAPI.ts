
/**
 * Medisca SDS API Service
 * This service handles interactions with Medisca's publicly accessible SDS database
 */

import { toast } from "sonner";

// Base URL for Medisca's public SDS database
const MEDISCA_BASE_URL = "https://www.medisca.com/Pages/ProductPages/SDSPages";

/**
 * Generates the URL for a specific ingredient's SDS
 * Note: This is based on Medisca's URL pattern which may change
 * @param ingredientName The name of the ingredient to search for
 * @returns URL string for the ingredient's SDS
 */
export const getSdsUrl = (ingredientName: string): string => {
  // Convert the ingredient name to the format used in Medisca URLs
  // This is a simplified version and may need adjustment based on actual URL patterns
  const formattedName = ingredientName.toLowerCase().replace(/\s+/g, '-');
  return `${MEDISCA_BASE_URL}/${formattedName}-sds.pdf`;
};

/**
 * Fetches the SDS PDF for a specific ingredient from Medisca
 * @param ingredientName The name of the ingredient to retrieve SDS for
 * @returns Promise with the PDF blob or null if not found
 */
export const fetchSdsPdf = async (ingredientName: string): Promise<Blob | null> => {
  try {
    const sdsUrl = getSdsUrl(ingredientName);
    console.log(`Attempting to fetch SDS for ${ingredientName} from: ${sdsUrl}`);
    
    const response = await fetch(sdsUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch SDS for ${ingredientName}: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const pdfBlob = await response.blob();
    return pdfBlob;
  } catch (error) {
    console.error(`Error fetching SDS for ${ingredientName}:`, error);
    return null;
  }
};

/**
 * Search for an ingredient in the Medisca database and return matching results
 * @param searchTerm The ingredient name to search for
 * @returns Promise with possible matches or empty array if none found
 */
export const searchMediscaIngredient = async (searchTerm: string): Promise<string[]> => {
  try {
    // In a real implementation, this would call Medisca's search API
    // For this demo, we'll simulate with a mock response
    console.log(`Searching Medisca for ingredient: ${searchTerm}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response based on common ingredients
    const mockDatabase = [
      "Ketoprofen", "Ketamine", "Baclofen", "Gabapentin", "Lidocaine", 
      "Prilocaine", "Estradiol", "Progesterone", "Testosterone", "Clonidine",
      "Amitriptyline", "Diclofenac", "Ibuprofen", "Metronidazole", "Nifedipine"
    ];
    
    const matches = mockDatabase.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return matches;
  } catch (error) {
    console.error(`Error searching Medisca database:`, error);
    toast.error("Failed to search Medisca database");
    return [];
  }
};

/**
 * Store of cached SDS information to avoid repeated network requests
 */
const sdsCache: Record<string, SDSData> = {};

/**
 * SDS Data structure containing parsed safety information
 */
export interface SDSData {
  ingredientName: string;
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
  timestamp: number; // When this data was retrieved/cached
}

/**
 * Retrieves and parses SDS data for a specific ingredient
 * @param ingredientName The name of the ingredient to retrieve SDS for
 * @returns Promise with the parsed SDS data or null if unavailable
 */
export const getSdsData = async (ingredientName: string): Promise<SDSData | null> => {
  // Check if we have cached data for this ingredient
  if (sdsCache[ingredientName.toLowerCase()]) {
    console.log(`Using cached SDS data for ${ingredientName}`);
    return sdsCache[ingredientName.toLowerCase()];
  }
  
  try {
    // For a real implementation, this would:
    // 1. Fetch the PDF from Medisca
    // 2. Parse the PDF to extract relevant data
    // 3. Format the data according to our interface
    
    // For this demo, we'll simulate with mock data
    console.log(`Retrieving SDS data for ${ingredientName}`);
    toast.info(`Retrieving SDS data for ${ingredientName}...`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock SDS data based on the ingredient name
    const sdsData = generateMockSdsData(ingredientName);
    
    // Cache the result
    sdsCache[ingredientName.toLowerCase()] = sdsData;
    
    toast.success(`SDS data retrieved for ${ingredientName}`);
    return sdsData;
  } catch (error) {
    console.error(`Error retrieving SDS data for ${ingredientName}:`, error);
    toast.error(`Failed to retrieve SDS data for ${ingredientName}`);
    return null;
  }
};

/**
 * Clear the SDS cache for a fresh retrieval
 */
export const clearSdsCache = () => {
  console.log("Clearing SDS data cache");
  Object.keys(sdsCache).forEach(key => delete sdsCache[key]);
};

/**
 * Generates mock SDS data for demo purposes
 * In a real implementation, this would be replaced with actual PDF parsing
 */
const generateMockSdsData = (ingredientName: string): SDSData => {
  const lowerName = ingredientName.toLowerCase();
  
  // Map known ingredients to specific mock data
  if (lowerName.includes("ketoprofen")) {
    return {
      ingredientName: ingredientName,
      hazardClassification: {
        ghs: ["Skin Irritation Category 2", "Eye Irritation Category 2", "Specific Target Organ Toxicity - Single Exposure Category 3"],
        whmis: ["Health Hazard", "Exclamation Mark"]
      },
      recommendedPPE: {
        gloves: "Nitrile gloves",
        respiratoryProtection: "Dust mask when handling powder",
        eyeProtection: "Safety glasses with side-shields",
        bodyProtection: "Lab coat"
      },
      exposureRisks: ["Skin irritation", "Eye irritation", "Respiratory irritation"],
      handlingPrecautions: [
        "Avoid breathing dust/fume/gas/mist/vapors/spray",
        "Use only in well-ventilated areas",
        "Wash hands thoroughly after handling"
      ],
      timestamp: Date.now()
    };
  } 
  else if (lowerName.includes("estradiol")) {
    return {
      ingredientName: ingredientName,
      hazardClassification: {
        ghs: ["Reproductive Toxicity Category 1", "Carcinogenicity Category 1"],
        whmis: ["Health Hazard"]
      },
      recommendedPPE: {
        gloves: "Double gloves (nitrile)",
        respiratoryProtection: "N95 respirator",
        eyeProtection: "Safety goggles",
        bodyProtection: "Disposable gown"
      },
      exposureRisks: ["Reproductive harm", "Endocrine effects", "Potential carcinogenic effects"],
      handlingPrecautions: [
        "Avoid all contact",
        "Handle in closed system if possible",
        "Containment required",
        "Special disposal procedures required"
      ],
      timestamp: Date.now()
    };
  }
  else if (lowerName.includes("lidocaine") || lowerName.includes("prilocaine")) {
    return {
      ingredientName: ingredientName,
      hazardClassification: {
        ghs: ["Acute Toxicity Category 4"],
        whmis: ["Exclamation Mark"]
      },
      recommendedPPE: {
        gloves: "Nitrile gloves",
        respiratoryProtection: "Not typically required",
        eyeProtection: "Safety glasses",
        bodyProtection: "Lab coat"
      },
      exposureRisks: ["May cause dizziness or drowsiness", "Skin absorption possible"],
      handlingPrecautions: [
        "Avoid prolonged skin contact",
        "Wash hands thoroughly after handling",
        "Avoid ingestion"
      ],
      timestamp: Date.now()
    };
  }
  else {
    // Default generic SDS data for other ingredients
    return {
      ingredientName: ingredientName,
      hazardClassification: {
        ghs: ["Not classified as hazardous according to GHS"],
        whmis: ["Not classified as hazardous according to WHMIS"]
      },
      recommendedPPE: {
        gloves: "Regular nitrile gloves",
        respiratoryProtection: "Not required under normal conditions",
        eyeProtection: "Safety glasses recommended",
        bodyProtection: "Regular lab coat"
      },
      exposureRisks: ["No significant risks under normal conditions"],
      handlingPrecautions: [
        "Follow good laboratory practices",
        "Wash hands after handling",
        "Keep container closed when not in use"
      ],
      timestamp: Date.now()
    };
  }
};
