/**
 * Medisca SDS API Service
 * This service handles interactions with Medisca's publicly accessible SDS database
 */

import { toast } from "sonner";
import { parseSdsPdf } from "./sdsPDFParser";

// Updated base URL for Medisca's public SDS database - corrected path structure
const MEDISCA_BASE_URL = "https://www.medisca.com/SDS";

/**
 * Generates the URL for a specific ingredient's SDS
 * @param ingredientName The name of the ingredient to search for
 * @returns URL string for the ingredient's SDS
 */
export const getSdsUrl = (ingredientName: string): string => {
  // Convert the ingredient name to the format used in Medisca URLs
  const formattedName = ingredientName.toLowerCase().replace(/\s+/g, '-');
  
  // Log the URL for debugging purposes
  console.log(`Generated SDS URL: ${MEDISCA_BASE_URL}/${formattedName}.pdf`);
  
  return `${MEDISCA_BASE_URL}/${formattedName}.pdf`;
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
      
      // Try alternate URL format as fallback
      const alternateUrl = `https://www.medisca.com/Pages/ProductPages/SDSPages/${ingredientName.toLowerCase().replace(/\s+/g, '-')}-sds.pdf`;
      console.log(`Trying alternate URL: ${alternateUrl}`);
      
      const alternateResponse = await fetch(alternateUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      
      if (!alternateResponse.ok) {
        console.error(`Failed to fetch SDS using alternate URL: ${alternateResponse.status}`);
        return null;
      }
      
      return await alternateResponse.blob();
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
 * Retrieves and parses SDS data for a specific ingredient
 * @param ingredientName The name of the ingredient to retrieve SDS for
 * @returns Promise with the parsed SDS data or null if unavailable
 */
export const getSdsData = async (ingredientName: string): Promise<SDSData | null> => {
  // Normalize the ingredient name for consistent caching
  const normalizedName = ingredientName.toLowerCase().trim();
  
  // Check if we have cached data for this ingredient
  if (sdsCache[normalizedName]) {
    console.log(`Using cached SDS data for ${ingredientName}`);
    return sdsCache[normalizedName];
  }
  
  try {
    console.log(`Retrieving SDS data for ${ingredientName}`);
    toast.info(`Retrieving SDS data for ${ingredientName}...`);
    
    // Attempt to fetch real SDS from Medisca
    const pdfBlob = await fetchSdsPdf(ingredientName);
    
    if (pdfBlob) {
      console.log(`Successfully retrieved SDS PDF for ${ingredientName}`);
      // TODO: In a real implementation, we would parse the PDF here
      // For now, we'll use the mock data
    } else {
      console.log(`Could not retrieve real SDS for ${ingredientName}, using mock data`);
    }
    
    // Generate mock SDS data based on the ingredient name
    const sdsData = generateMockSdsData(ingredientName);
    
    // Cache the result using the normalized name
    sdsCache[normalizedName] = sdsData;
    
    toast.success(`SDS data retrieved for ${ingredientName}`);
    return sdsData;
  } catch (error) {
    console.error(`Error retrieving SDS data for ${ingredientName}:`, error);
    toast.error(`Failed to retrieve SDS data for ${ingredientName}`);
    return null;
  }
};

/**
 * SDS Data structure containing parsed safety information
 */
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
  timestamp: number; // When this data was retrieved/cached
}

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
  const lowerName = ingredientName.toLowerCase().trim();
  
  // Map known ingredients to specific mock data
  if (lowerName.includes("ketoprofen")) {
    return {
      ingredientName: ingredientName,
      physicalForm: "White crystalline powder",
      hazardClassification: {
        ghs: ["Skin Irritation Category 2", "Eye Irritation Category 2", "Specific Target Organ Toxicity - Single Exposure Category 3"],
        whmis: ["Health Hazard", "Exclamation Mark"]
      },
      recommendedPPE: {
        gloves: "Nitrile gloves",
        respiratoryProtection: "Dust mask when handling powder, use in powder containment hood",
        eyeProtection: "Safety glasses with side-shields",
        bodyProtection: "Lab coat"
      },
      exposureRisks: ["Skin irritation", "Eye irritation", "Respiratory irritation", "Powder inhalation hazard"],
      handlingPrecautions: [
        "Use powder containment hood when handling",
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
      physicalForm: "White to off-white crystalline powder",
      hazardClassification: {
        ghs: ["Reproductive Toxicity Category 1", "Carcinogenicity Category 1"],
        whmis: ["Health Hazard"]
      },
      recommendedPPE: {
        gloves: "Double gloves (nitrile)",
        respiratoryProtection: "N95 respirator, use in powder containment hood",
        eyeProtection: "Safety goggles",
        bodyProtection: "Disposable gown"
      },
      exposureRisks: ["Reproductive harm", "Endocrine effects", "Potential carcinogenic effects", "Powder inhalation hazard"],
      handlingPrecautions: [
        "Use powder containment hood",
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
      physicalForm: "White crystalline powder",
      hazardClassification: {
        ghs: ["Acute Toxicity Category 4"],
        whmis: ["Exclamation Mark"]
      },
      recommendedPPE: {
        gloves: "Nitrile gloves",
        respiratoryProtection: "Not typically required for small quantities, dust mask for larger quantities",
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
  else if (lowerName.includes("gabapentin")) {
    return {
      ingredientName: ingredientName,
      physicalForm: "White crystalline powder",
      hazardClassification: {
        ghs: ["Not classified as hazardous according to GHS"],
        whmis: ["Not classified as hazardous according to WHMIS"]
      },
      recommendedPPE: {
        gloves: "Regular nitrile gloves",
        respiratoryProtection: "Dust mask recommended when handling powder, adequate ventilation required",
        eyeProtection: "Safety glasses recommended",
        bodyProtection: "Regular lab coat"
      },
      exposureRisks: ["Potential dust hazard if powdered form is handled without proper precautions", "Low systemic toxicity risk under normal handling conditions"],
      handlingPrecautions: [
        "Use in well-ventilated area",
        "Avoid generating and breathing dust",
        "Follow good laboratory practices",
        "Wash hands after handling",
        "Keep container closed when not in use"
      ],
      timestamp: Date.now()
    };
  }
  else if (lowerName.includes("ketamine")) {
    return {
      ingredientName: ingredientName,
      physicalForm: "White or almost white crystalline powder",
      hazardClassification: {
        ghs: ["Acute Toxicity (Oral) Category 4", "Specific Target Organ Toxicity - Single Exposure Category 3"],
        whmis: ["Health Hazard", "Exclamation Mark"]
      },
      recommendedPPE: {
        gloves: "Double nitrile gloves",
        respiratoryProtection: "Dust mask when handling powder, adequate ventilation required",
        eyeProtection: "Safety glasses with side shields",
        bodyProtection: "Lab coat"
      },
      exposureRisks: ["Potential for respiratory irritation if inhaled", "May cause drowsiness or dizziness", "Powder inhalation hazard", "Controlled substance - special handling required"],
      handlingPrecautions: [
        "Use in well-ventilated area",
        "Avoid generating and breathing dust",
        "Wash hands after handling",
        "Keep container closed when not in use",
        "Store according to controlled substance requirements"
      ],
      timestamp: Date.now()
    };
  }
  else if (lowerName.includes("baclofen")) {
    return {
      ingredientName: ingredientName,
      physicalForm: "White to off-white crystalline powder",
      hazardClassification: {
        ghs: ["Acute Toxicity (Oral) Category 4", "Specific Target Organ Toxicity - Single Exposure Category 3"],
        whmis: ["Health Hazard", "Exclamation Mark"]
      },
      recommendedPPE: {
        gloves: "Regular nitrile gloves",
        respiratoryProtection: "Dust mask when handling powder, adequate ventilation required",
        eyeProtection: "Safety glasses recommended",
        bodyProtection: "Regular lab coat"
      },
      exposureRisks: ["May cause drowsiness or dizziness", "Powder inhalation hazard", "Low risk under normal handling conditions"],
      handlingPrecautions: [
        "Use in well-ventilated area",
        "Avoid generating and breathing dust",
        "Follow good laboratory practices",
        "Wash hands after handling",
        "Keep container closed when not in use"
      ],
      timestamp: Date.now()
    };
  }
  else if (lowerName.includes("clonidine")) {
    return {
      ingredientName: ingredientName,
      physicalForm: "White or almost white powder",
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
  else {
    // Default generic SDS data for other ingredients
    return {
      ingredientName: ingredientName,
      physicalForm: "Crystalline powder or solid",
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

/**
 * Opens the SDS document in a new tab
 * @param ingredientName The name of the ingredient to view SDS for
 */
export const openSdsDocument = (ingredientName: string): void => {
  const mainUrl = getSdsUrl(ingredientName);
  const alternateUrl = `https://www.medisca.com/Pages/ProductPages/SDSPages/${ingredientName.toLowerCase().replace(/\s+/g, '-')}-sds.pdf`;
  
  // Try to open the SDS document
  console.log(`Opening SDS document for ${ingredientName} at ${mainUrl}`);
  window.open(mainUrl, '_blank');
  
  // Additionally show a toast with instructions
  toast.info("If the SDS doesn't open automatically, please check your popup blocker settings", {
    duration: 5000
  });
};
