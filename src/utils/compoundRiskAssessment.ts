
/**
 * Compound Risk Assessment Utilities
 * Integrates SDS and NIOSH data for comprehensive risk assessment
 */

import { getSdsData } from "@/services/sdsAPI";
import { getNioshHazardInfo } from "@/services/nioshAPI";
import { 
  SDSData,
  isPowderFormIngredient,
  isCreamOrOintment,
  requiresSpecialVentilation
} from "@/utils/mediscaAPI";
import {
  NioshDrugInfo, 
  HazardLevel,
  NAPRARiskLevel,
  getHazardLevelFromSDS,
  getCombinedHazardLevel,
  determineNAPRARiskLevel,
  generateNAPRARationale,
  getPPERecommendations
} from "@/utils/nioshData";

/**
 * Interface for ingredient assessment data
 */
export interface IngredientAssessment {
  name: string;
  sdsData: SDSData | null;
  nioshStatus: NioshDrugInfo;
  hazardLevel: HazardLevel;
  isPowder: boolean;
  isNarcotic: boolean;
  reproductiveToxicity: boolean;
}

/**
 * Interface for compound assessment data
 */
export interface CompoundAssessment {
  compoundName: string;
  din: string;
  activeIngredients: IngredientAssessment[];
  physicalCharacteristics: string[];
  riskLevel: NAPRARiskLevel;
  rationale: string;
  ppe: {
    gloves: string;
    gown: string;
    mask: string;
    eyeProtection: boolean;
    otherPPE: string[];
  };
  engineeringControls: string[];
  timestamp: number;
}

/**
 * Perform a comprehensive risk assessment on a compound
 * @param compoundName Name of the compound
 * @param din Drug Identification Number
 * @param ingredients List of ingredient names
 * @param physicalCharacteristics Physical characteristics of the compound
 * @returns CompoundAssessment object with risk assessment details
 */
export const performCompoundRiskAssessment = async (
  compoundName: string,
  din: string,
  ingredients: string[],
  physicalCharacteristics: string[]
): Promise<CompoundAssessment> => {
  console.log(`Performing risk assessment for compound: ${compoundName}`);
  
  // Assess each ingredient
  const ingredientAssessments = await Promise.all(
    ingredients.map(async (ingredient): Promise<IngredientAssessment> => {
      // Get SDS data for ingredient
      const sdsData = await getSdsData(ingredient);
      
      // Get NIOSH hazard info for ingredient
      const nioshStatus = await getNioshHazardInfo(ingredient);
      
      // Determine hazard level based on combined SDS and NIOSH data
      const hazardLevel = getCombinedHazardLevel(nioshStatus, sdsData);
      
      // Check if the ingredient is in powder form
      const isPowder = isPowderFormIngredient(sdsData);
      
      // Check if the ingredient is a narcotic
      const isNarcotic = isNarcoticSubstance(ingredient);
      
      // Check for reproductive toxicity
      const reproductiveToxicity = checkReproductiveToxicity(nioshStatus, sdsData);
      
      return {
        name: ingredient,
        sdsData,
        nioshStatus,
        hazardLevel,
        isPowder,
        isNarcotic,
        reproductiveToxicity
      };
    })
  );
  
  // Build assessment data object
  const assessmentData = {
    compoundName,
    din,
    activeIngredients: ingredientAssessments,
    physicalCharacteristics,
    safetyChecks: {
      ventilationRequired: ingredientAssessments.some(
        ingredient => requiresSpecialVentilation(ingredient.sdsData)
      ),
      specialEducation: {
        required: ingredientAssessments.some(
          ingredient => ingredient.hazardLevel !== "Non-Hazardous"
        )
      }
    },
    workflowConsiderations: {
      microbialContaminationRisk: false,
      crossContaminationRisk: ingredientAssessments.some(
        ingredient => ingredient.hazardLevel !== "Non-Hazardous"
      )
    },
    preparationDetails: {
      concentrationRisk: ingredientAssessments.some(
        ingredient => ingredient.hazardLevel !== "Non-Hazardous"
      )
    }
  };
  
  // Determine NAPRA risk level
  const riskLevel = determineNAPRARiskLevel(assessmentData);
  
  // Generate rationale for the assigned risk level
  const rationale = generateNAPRARationale(assessmentData, riskLevel);
  
  // Determine worst-case hazard level for PPE recommendations
  const worstCaseHazardLevel = ingredientAssessments.reduce(
    (worst, ingredient) => {
      if (ingredient.hazardLevel === "High Hazard") return "High Hazard";
      if (worst === "Non-Hazardous" && ingredient.hazardLevel === "Moderate Hazard") return "Moderate Hazard";
      return worst;
    }, 
    "Non-Hazardous" as HazardLevel
  );
  
  // Get PPE recommendations
  const ppeRecommendations = getPPERecommendations(worstCaseHazardLevel);
  
  // Determine engineering controls based on risk level
  const engineeringControls = determineEngineeringControls(riskLevel, assessmentData);
  
  return {
    compoundName,
    din,
    activeIngredients: ingredientAssessments,
    physicalCharacteristics,
    riskLevel,
    rationale,
    ppe: ppeRecommendations,
    engineeringControls,
    timestamp: Date.now()
  };
};

/**
 * Check if a substance is a narcotic/controlled substance
 * @param name Name of the substance
 * @returns Boolean indicating if it's a narcotic
 */
const isNarcoticSubstance = (name: string): boolean => {
  const narcoticKeywords = [
    "ketamine", "codeine", "morphine", "fentanyl", 
    "hydrocodone", "oxycodone", "hydromorphone", "methadone",
    "buprenorphine", "tramadol", "opioid", "diazepam",
    "lorazepam", "alprazolam", "clonazepam", "midazolam"
  ];
  
  // Explicitly exclude baclofen and other non-narcotics that might contain substring matches
  if (name.toLowerCase() === "baclofen") return false;
  
  return narcoticKeywords.some(keyword => 
    name.toLowerCase().includes(keyword)
  );
};

/**
 * Check if a substance has reproductive toxicity
 * @param nioshInfo NIOSH drug information
 * @param sdsData SDS data
 * @returns Boolean indicating if it has reproductive toxicity
 */
const checkReproductiveToxicity = (nioshInfo: NioshDrugInfo, sdsData: SDSData | null): boolean => {
  // Check NIOSH data for reproductive toxicity
  if (nioshInfo.hazardType?.some(
    (type: string) => type.toLowerCase().includes("reproductive")
  )) {
    return true;
  }
  
  // Check SDS data for reproductive toxicity mentions
  if (sdsData) {
    const reproKeywords = ["reproductive", "fertility", "teratogenic", "embryo", "fetus"];
    return sdsData.hazardClassification.ghs.some(
      (hazard: string) => reproKeywords.some(keyword => hazard.toLowerCase().includes(keyword))
    );
  }
  
  return false;
};

/**
 * Determine engineering controls based on risk level
 * @param riskLevel NAPRA risk level
 * @param assessmentData Assessment data
 * @returns Array of recommended engineering controls
 */
const determineEngineeringControls = (
  riskLevel: NAPRARiskLevel, 
  assessmentData: any
): string[] => {
  const controls: string[] = [];
  
  switch (riskLevel) {
    case "Level C":
      controls.push("Containment Primary Engineering Control (C-PEC)");
      controls.push("Dedicated room with negative pressure");
      controls.push("HEPA filtration");
      controls.push("External ventilation");
      break;
    
    case "Level B":
      const hasPowder = assessmentData.activeIngredients.some((i: any) => i.isPowder);
      
      if (hasPowder) {
        controls.push("Powder containment hood");
      }
      
      controls.push("Segregated compounding area");
      controls.push("Local exhaust ventilation");
      break;
    
    case "Level A":
      controls.push("Non-segregated compounding area");
      
      // Add ventilation for any powder handling even in Level A
      const hasAnyPowder = assessmentData.activeIngredients.some((i: any) => i.isPowder);
      if (hasAnyPowder) {
        controls.push("General ventilation");
      }
      break;
  }
  
  return controls;
};
