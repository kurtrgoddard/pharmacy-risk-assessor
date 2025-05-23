
export interface PubChemCompound {
  CID: number;
  Title: string;
  MolecularFormula?: string;
  MolecularWeight?: number;
  IUPACName?: string;
}

export interface PubChemPropertyResponse {
  PropertyTable: {
    Properties: Array<{
      CID: number;
      MolecularFormula?: string;
      MolecularWeight?: number;
      IUPACName?: string;
    }>;
  };
}

export interface PubChemSynonymResponse {
  InformationList: {
    Information: Array<{
      CID: number;
      Synonym: string[];
    }>;
  };
}

export interface HazardClassification {
  code: string;
  category: string;
  description: string;
  source: string;
}

export interface GHSData {
  classifications: HazardClassification[];
  pictograms: string[];
  signalWord: 'Danger' | 'Warning';
}

export interface PhysicalProperties {
  molecularWeight?: number;
  physicalForm: 'powder' | 'liquid' | 'solid' | 'gas';
  solubility: string;
  additionalProperties?: {
    logP?: number;
    polarSurfaceArea?: number;
    smiles?: string;
  };
}
