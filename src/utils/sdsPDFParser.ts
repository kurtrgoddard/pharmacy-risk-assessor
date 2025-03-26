
/**
 * SDS PDF Parser
 * Extracts relevant safety information from SDS PDF documents
 */

import * as pdfjsLib from "pdfjs-dist";
import { SDSData } from "./mediscaAPI";

// Set the worker source path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Parse an SDS PDF and extract relevant safety information
 * @param pdfBlob The PDF blob to parse
 * @param ingredientName The name of the ingredient
 * @returns Promise with parsed SDS data
 */
export const parseSdsPdf = async (pdfBlob: Blob, ingredientName: string): Promise<SDSData | null> => {
  try {
    console.log(`Parsing SDS PDF for ${ingredientName}...`);
    
    // Convert blob to ArrayBuffer for PDF.js
    const arrayBuffer = await pdfBlob.arrayBuffer();
    
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    // Initialize sections to extract
    let hazardSection = "";
    let ppeSection = "";
    let handlingSection = "";
    
    // Extract text from each page
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + " ";
    }
    
    console.log("Extracted text length:", fullText.length);
    
    // Find relevant sections in the text
    // These regex patterns would need to be refined based on actual SDS format
    
    // Extract hazard information (Section 2 in most SDS)
    const hazardMatch = fullText.match(/(?:2\.\s*Hazard(?:s)? Identification)(.*?)(?:3\.\s*Composition\/Information)/si);
    if (hazardMatch && hazardMatch[1]) {
      hazardSection = hazardMatch[1].trim();
    }
    
    // Extract PPE information (Section 8 in most SDS)
    const ppeMatch = fullText.match(/(?:8\.\s*Exposure Controls\/Personal Protection)(.*?)(?:9\.\s*Physical)/si);
    if (ppeMatch && ppeMatch[1]) {
      ppeSection = ppeMatch[1].trim();
    }
    
    // Extract handling information (Section 7 in most SDS)
    const handlingMatch = fullText.match(/(?:7\.\s*Handling and Storage)(.*?)(?:8\.\s*Exposure)/si);
    if (handlingMatch && handlingMatch[1]) {
      handlingSection = handlingMatch[1].trim();
    }
    
    console.log("Parsed SDS sections:", {
      hazardSection: hazardSection.substring(0, 50) + "...",
      ppeSection: ppeSection.substring(0, 50) + "...",
      handlingSection: handlingSection.substring(0, 50) + "..."
    });
    
    // Process the extracted text to create structured SDS data
    // In a real implementation, this would use more sophisticated NLP techniques
    const sdsData = processSdsSections(hazardSection, ppeSection, handlingSection, ingredientName);
    
    return sdsData;
  } catch (error) {
    console.error(`Error parsing SDS PDF for ${ingredientName}:`, error);
    return null;
  }
};

/**
 * Process SDS text sections to extract structured data
 * In a real implementation, this would use more sophisticated text analysis
 */
const processSdsSections = (
  hazardText: string, 
  ppeText: string, 
  handlingText: string,
  ingredientName: string
): SDSData => {
  // Extract GHS classifications
  const ghsClassifications = extractGHSClassifications(hazardText);
  
  // Extract WHMIS classifications
  const whmisClassifications = extractWHMISClassifications(hazardText);
  
  // Extract PPE recommendations
  const ppeRecommendations = extractPPERecommendations(ppeText);
  
  // Extract exposure risks
  const exposureRisks = extractExposureRisks(hazardText);
  
  // Extract handling precautions
  const handlingPrecautions = extractHandlingPrecautions(handlingText);
  
  return {
    ingredientName,
    hazardClassification: {
      ghs: ghsClassifications,
      whmis: whmisClassifications
    },
    recommendedPPE: ppeRecommendations,
    exposureRisks,
    handlingPrecautions,
    timestamp: Date.now()
  };
};

/**
 * Extract GHS hazard classifications from text
 * In a real implementation, this would use more sophisticated pattern matching
 */
const extractGHSClassifications = (text: string): string[] => {
  const classifications: string[] = [];
  
  // Look for common GHS hazard phrases
  if (text.match(/skin\s+corrosion/i)) classifications.push("Skin Corrosion");
  if (text.match(/skin\s+irritation/i)) classifications.push("Skin Irritation");
  if (text.match(/eye\s+damage/i)) classifications.push("Serious Eye Damage");
  if (text.match(/eye\s+irritation/i)) classifications.push("Eye Irritation");
  if (text.match(/respiratory\s+sensitization/i)) classifications.push("Respiratory Sensitization");
  if (text.match(/skin\s+sensitization/i)) classifications.push("Skin Sensitization");
  if (text.match(/carcinogen/i)) classifications.push("Carcinogenicity");
  if (text.match(/mutagen/i)) classifications.push("Germ Cell Mutagenicity");
  if (text.match(/reproductive/i)) classifications.push("Reproductive Toxicity");
  if (text.match(/specific\s+target\s+organ/i)) classifications.push("Specific Target Organ Toxicity");
  if (text.match(/aspiration/i)) classifications.push("Aspiration Hazard");
  
  // If no classifications found, assume non-hazardous
  if (classifications.length === 0) {
    classifications.push("Not classified as hazardous according to GHS");
  }
  
  return classifications;
};

/**
 * Extract WHMIS hazard classifications from text
 */
const extractWHMISClassifications = (text: string): string[] => {
  const classifications: string[] = [];
  
  // Look for common WHMIS symbols/hazards
  if (text.match(/flammable/i)) classifications.push("Flammable");
  if (text.match(/oxidizing/i)) classifications.push("Oxidizing");
  if (text.match(/gas\s+under\s+pressure/i)) classifications.push("Gas Under Pressure");
  if (text.match(/acute\s+toxic/i)) classifications.push("Acute Toxicity");
  if (text.match(/health\s+hazard/i)) classifications.push("Health Hazard");
  if (text.match(/corrosive/i)) classifications.push("Corrosive");
  if (text.match(/biohazard/i)) classifications.push("Biohazardous");
  
  // If no classifications found, assume non-hazardous
  if (classifications.length === 0) {
    classifications.push("Not classified as hazardous according to WHMIS");
  }
  
  return classifications;
};

/**
 * Extract PPE recommendations from text
 */
const extractPPERecommendations = (text: string): {
  gloves: string;
  respiratoryProtection: string;
  eyeProtection: string;
  bodyProtection: string;
} => {
  let gloves = "Not specified";
  let respiratoryProtection = "Not specified";
  let eyeProtection = "Not specified";
  let bodyProtection = "Not specified";
  
  // Extract glove recommendations
  const glovesMatch = text.match(/gloves?:?\s*([^\.]*\.)/i);
  if (glovesMatch && glovesMatch[1]) {
    gloves = glovesMatch[1].trim();
  } else if (text.match(/nitrile/i)) {
    gloves = "Nitrile gloves recommended";
  } else if (text.match(/latex/i)) {
    gloves = "Latex gloves recommended";
  }
  
  // Extract respiratory protection
  const respiratoryMatch = text.match(/respiratory\s+protection:?\s*([^\.]*\.)/i);
  if (respiratoryMatch && respiratoryMatch[1]) {
    respiratoryProtection = respiratoryMatch[1].trim();
  } else if (text.match(/N95/i)) {
    respiratoryProtection = "N95 respirator recommended";
  } else if (text.match(/dust\s+mask/i)) {
    respiratoryProtection = "Dust mask recommended";
  }
  
  // Extract eye protection
  const eyeMatch = text.match(/eye\s+protection:?\s*([^\.]*\.)/i);
  if (eyeMatch && eyeMatch[1]) {
    eyeProtection = eyeMatch[1].trim();
  } else if (text.match(/safety\s+glasses/i)) {
    eyeProtection = "Safety glasses recommended";
  } else if (text.match(/goggles/i)) {
    eyeProtection = "Safety goggles recommended";
  }
  
  // Extract body protection
  const bodyMatch = text.match(/(?:body|protective)\s+(?:protection|clothing):?\s*([^\.]*\.)/i);
  if (bodyMatch && bodyMatch[1]) {
    bodyProtection = bodyMatch[1].trim();
  } else if (text.match(/lab\s+coat/i)) {
    bodyProtection = "Lab coat recommended";
  }
  
  return {
    gloves,
    respiratoryProtection,
    eyeProtection,
    bodyProtection
  };
};

/**
 * Extract exposure risks from text
 */
const extractExposureRisks = (text: string): string[] => {
  const risks: string[] = [];
  
  // Look for common risk phrases
  if (text.match(/skin\s+(?:irritation|corrosion)/i)) 
    risks.push("May cause skin irritation");
  if (text.match(/eye\s+(?:irritation|damage)/i)) 
    risks.push("May cause eye irritation");
  if (text.match(/respiratory\s+(?:irritation|sensitization)/i)) 
    risks.push("May cause respiratory irritation");
  if (text.match(/harmful\s+if\s+swallowed/i)) 
    risks.push("Harmful if swallowed");
  if (text.match(/harmful\s+(?:in|through)\s+contact\s+with\s+skin/i)) 
    risks.push("Harmful in contact with skin");
  if (text.match(/harmful\s+if\s+inhaled/i)) 
    risks.push("Harmful if inhaled");
  
  // If no specific risks found
  if (risks.length === 0) {
    risks.push("No significant risks under normal handling conditions");
  }
  
  return risks;
};

/**
 * Extract handling precautions from text
 */
const extractHandlingPrecautions = (text: string): string[] => {
  const precautions: string[] = [];
  
  // Look for common handling instructions
  if (text.match(/avoid\s+(?:breathing|inhaling)/i)) 
    precautions.push("Avoid breathing dust/fume/gas/mist/vapors/spray");
  if (text.match(/ventilat(?:ed|ion)/i)) 
    precautions.push("Use only in well-ventilated areas");
  if (text.match(/wash\s+(?:hands|thoroughly)/i)) 
    precautions.push("Wash hands thoroughly after handling");
  if (text.match(/protective\s+(?:equipment|clothing)/i)) 
    precautions.push("Wear protective equipment");
  if (text.match(/container\s+(?:tightly|sealed|closed)/i)) 
    precautions.push("Keep container tightly closed");
  
  // Add default handling precautions if none found
  if (precautions.length === 0) {
    precautions.push("Follow standard safe handling procedures");
    precautions.push("Wash hands after handling");
  }
  
  return precautions;
};
