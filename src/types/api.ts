
export interface CompoundFormulation {
  name: string;
  dosageForm: string;
  totalQuantity: number;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
    percentage?: number;
  }[];
}

export type RiskLevel = 'A' | 'B' | 'C';

export interface PPERequirement {
  type: string;
  specification: string;
}

export interface HazardAssessment {
  ingredientName: string;
  normalizedName: string;
  casNumber?: string;
  hazardClassifications: {
    ghs: Array<{
      code: string;
      category: string;
      description: string;
      pictogram?: string;
    }>;
    niosh?: {
      table?: number;
      isHazardous?: boolean;
      hasReproductiveToxicity?: boolean;
      isCarcinogenic?: boolean;
    };
    regulatory: any[];
  };
  physicalProperties: {
    physicalForm: 'powder' | 'liquid' | 'solid' | 'gas';
    solubility: string;
    molecularWeight?: number;
  };
  safetyInfo: {
    handlingPrecautions: string[];
    ppeRequirements: PPERequirement[];
    engineeringControls: string[];
    spillResponse: string[];
  };
  dataQuality: {
    sources: Array<{
      name: string;
      url: string;
    }>;
    confidence: number;
    lastUpdated: Date;
    warnings: string[];
    verificationRequired?: boolean;
  };
}

export interface IngredientAssessment {
  ingredient: CompoundFormulation['ingredients'][0];
  hazardData: HazardAssessment;
  contributionToRisk: 'high' | 'medium' | 'low';
  specificConcerns: string[];
}

export interface RiskAssessment {
  compound: CompoundFormulation;
  overallRiskLevel: RiskLevel;
  ingredientAssessments: IngredientAssessment[];
  requiredPPE: PPERequirement[];
  requiredControls: string[];
  additionalPrecautions: string[];
  assessmentDate: Date;
  reviewRequired: boolean;
  expiryDate: Date;
}

export interface SDSInfo {
  productName: string;
  casNumber: string;
  physicalForm: string;
  hazardClassifications: Array<{
    category: string;
    pictogram: string;
    signalWord: string;
    hazardStatement: string;
  }>;
  ppeRequirements: PPERequirement[];
  handlingPrecautions: string[];
  storageRequirements: string[];
  spillResponse: string[];
  firstAid: {
    inhalation: string;
    skinContact: string;
    eyeContact: string;
    ingestion: string;
  };
  fireHazard: string;
  sdsUrl: string;
}

export interface SDSSearchResult {
  productName: string;
  casNumber: string;
  manufacturer: string;
  sdsUrl: string;
  lastUpdated: string;
}
