
export interface HazardClassification {
  code: string;
  category: string;
  description: string;
  source: string;
}

export interface PPERequirement {
  type: string;
  specification: string;
}

export interface DataSource {
  name: string;
  url: string;
}

export interface HazardAssessment {
  ingredientName: string;
  normalizedName: string;
  casNumber?: string;
  hazardClassifications: {
    ghs: HazardClassification[];
    niosh?: any;
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
    sources: DataSource[];
    confidence: number;
    lastUpdated: Date;
    warnings: string[];
  };
}
