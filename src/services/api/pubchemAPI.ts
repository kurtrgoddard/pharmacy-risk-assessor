
interface PubChemCompound {
  CID: number;
  Title: string;
  MolecularFormula: string;
  MolecularWeight: number;
  IUPACName: string;
}

interface PubChemPropertyResponse {
  PropertyTable: {
    Properties: Array<{
      CID: number;
      MolecularFormula?: string;
      MolecularWeight?: number;
      IUPACName?: string;
    }>;
  };
}

interface PubChemSynonymResponse {
  InformationList: {
    Information: Array<{
      CID: number;
      Synonym: string[];
    }>;
  };
}

interface HazardClassification {
  code: string;
  category: string;
  description: string;
  source: string;
}

interface GHSData {
  classifications: HazardClassification[];
  pictograms: string[];
  signalWord: 'Danger' | 'Warning';
}

interface PhysicalProperties {
  molecularWeight?: number;
  physicalForm: 'powder' | 'liquid' | 'solid' | 'gas';
  solubility: string;
  additionalProperties?: {
    logP?: number;
    polarSurfaceArea?: number;
    smiles?: string;
  };
}

export class PubChemAPIService {
  private readonly baseURL = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
  private readonly timeout = 10000; // 10 seconds

  async searchCompound(name: string): Promise<PubChemCompound | null> {
    try {
      // Sanitize input
      const sanitizedName = this.sanitizeName(name);
      
      // First, get the CID (Compound ID)
      const cidResponse = await this.fetchWithTimeout(
        `${this.baseURL}/compound/name/${encodeURIComponent(sanitizedName)}/cids/JSON`
      );
      
      if (!cidResponse.IdentifierList?.CID?.length) {
        console.warn(`No PubChem compound found for: ${name}`);
        return null;
      }

      const cid = cidResponse.IdentifierList.CID[0];
      
      // Get compound properties
      const properties = await this.getCompoundProperties(cid);
      
      return {
        CID: cid,
        Title: sanitizedName,
        ...properties
      };
    } catch (error) {
      console.error('PubChem compound search failed:', error);
      return null;
    }
  }

  async getGHSClassification(cid: number): Promise<GHSData> {
    try {
      const response = await this.fetchWithTimeout(
        `${this.baseURL}/compound/cid/${cid}/classification/JSON`
      );

      const ghsClassifications = this.extractGHSClassifications(response);
      
      return {
        classifications: ghsClassifications,
        pictograms: this.mapToPictograms(ghsClassifications),
        signalWord: this.determineSignalWord(ghsClassifications)
      };
    } catch (error) {
      console.error('Failed to get GHS classification:', error);
      return {
        classifications: [],
        pictograms: [],
        signalWord: 'Warning' // Conservative default
      };
    }
  }

  async getPhysicalProperties(cid: number): Promise<PhysicalProperties> {
    try {
      // Get multiple properties in one call
      const response = await this.fetchWithTimeout(
        `${this.baseURL}/compound/cid/${cid}/property/MolecularWeight,IUPACName,CanonicalSMILES,XLogP,TPSA/JSON`
      );

      const props = response.PropertyTable?.Properties?.[0] || {};
      
      // Get additional descriptive data
      const description = await this.getCompoundDescription(cid);
      
      return {
        molecularWeight: props.MolecularWeight,
        physicalForm: this.inferPhysicalForm(props, description),
        solubility: this.inferSolubility(props.XLogP),
        additionalProperties: {
          logP: props.XLogP,
          polarSurfaceArea: props.TPSA,
          smiles: props.CanonicalSMILES
        }
      };
    } catch (error) {
      console.error('Failed to get physical properties:', error);
      return {
        physicalForm: 'powder', // Conservative default
        solubility: 'unknown'
      };
    }
  }

  async getSynonyms(cid: number): Promise<string[]> {
    try {
      const response = await this.fetchWithTimeout(
        `${this.baseURL}/compound/cid/${cid}/synonyms/JSON`
      );

      return response.InformationList?.Information?.[0]?.Synonym || [];
    } catch (error) {
      console.error('Failed to get synonyms:', error);
      return [];
    }
  }

  // Comprehensive hazard analysis combining multiple data sources
  async getComprehensiveHazardData(name: string) {
    const compound = await this.searchCompound(name);
    
    if (!compound) {
      return null;
    }

    const [ghsData, properties, synonyms] = await Promise.allSettled([
      this.getGHSClassification(compound.CID),
      this.getPhysicalProperties(compound.CID),
      this.getSynonyms(compound.CID)
    ]);

    return {
      compound,
      ghs: ghsData.status === 'fulfilled' ? ghsData.value : null,
      properties: properties.status === 'fulfilled' ? properties.value : null,
      synonyms: synonyms.status === 'fulfilled' ? synonyms.value : [],
      dataQuality: this.assessDataQuality(ghsData, properties, synonyms)
    };
  }

  // Private helper methods
  private async fetchWithTimeout(url: string): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  private sanitizeName(name: string): string {
    return name
      .trim()
      .replace(/[^\w\s\-\(\)]/g, '')
      .substring(0, 100);
  }

  private async getCompoundProperties(cid: number): Promise<Partial<PubChemCompound>> {
    try {
      const response = await this.fetchWithTimeout(
        `${this.baseURL}/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`
      );

      const props = response.PropertyTable?.Properties?.[0] || {};
      
      return {
        MolecularFormula: props.MolecularFormula,
        MolecularWeight: props.MolecularWeight,
        IUPACName: props.IUPACName
      };
    } catch (error) {
      console.error('Failed to get compound properties:', error);
      return {};
    }
  }

  private extractGHSClassifications(response: any): HazardClassification[] {
    const classifications: HazardClassification[] = [];
    
    if (!response.Classifications) {
      return classifications;
    }

    // Parse GHS classifications
    response.Classifications.forEach((classification: any) => {
      if (classification.Annotation?.SourceName?.includes('GHS')) {
        classifications.push({
          code: classification.Annotation.SourceID,
          category: classification.Annotation.SourceCategory,
          description: classification.Annotation.SourceValue,
          source: 'GHS'
        });
      }
    });

    return classifications;
  }

  private mapToPictograms(classifications: HazardClassification[]): string[] {
    const pictogramMap: Record<string, string> = {
      'explosive': 'GHS01',
      'flammable': 'GHS02',
      'oxidizing': 'GHS03',
      'compressed': 'GHS04',
      'corrosive': 'GHS05',
      'toxic': 'GHS06',
      'harmful': 'GHS07',
      'health hazard': 'GHS08',
      'environmental': 'GHS09'
    };

    const pictograms = new Set<string>();
    
    classifications.forEach(classification => {
      const desc = classification.description.toLowerCase();
      Object.entries(pictogramMap).forEach(([keyword, pictogram]) => {
        if (desc.includes(keyword)) {
          pictograms.add(pictogram);
        }
      });
    });

    return Array.from(pictograms);
  }

  private determineSignalWord(classifications: HazardClassification[]): 'Danger' | 'Warning' {
    // Check for high-hazard indicators
    const dangerKeywords = ['fatal', 'toxic', 'cancer', 'mutagenic', 'reproductive'];
    
    for (const classification of classifications) {
      const desc = classification.description.toLowerCase();
      if (dangerKeywords.some(keyword => desc.includes(keyword))) {
        return 'Danger';
      }
    }

    return 'Warning';
  }

  private async getCompoundDescription(cid: number): Promise<string> {
    try {
      const response = await this.fetchWithTimeout(
        `${this.baseURL}/compound/cid/${cid}/description/JSON`
      );
      
      return response.InformationList?.Information?.[0]?.Description || '';
    } catch {
      return '';
    }
  }

  private inferPhysicalForm(properties: any, description: string): 'powder' | 'liquid' | 'solid' | 'gas' {
    const desc = description.toLowerCase();
    
    if (desc.includes('powder') || desc.includes('crystalline')) {
      return 'powder';
    }
    if (desc.includes('liquid') || desc.includes('solution')) {
      return 'liquid';
    }
    if (desc.includes('gas') || desc.includes('vapor')) {
      return 'gas';
    }
    
    // Default to powder for pharmaceutical compounds (conservative)
    return 'powder';
  }

  private inferSolubility(logP?: number): string {
    if (logP === undefined) {
      return 'unknown';
    }
    
    if (logP < -1) {
      return 'highly water soluble';
    } else if (logP < 1) {
      return 'water soluble';
    } else if (logP < 3) {
      return 'moderately soluble';
    } else {
      return 'poorly water soluble';
    }
  }

  private assessDataQuality(
    ghsResult: PromiseSettledResult<GHSData>,
    propertiesResult: PromiseSettledResult<PhysicalProperties>,
    synonymsResult: PromiseSettledResult<string[]>
  ): number {
    let quality = 0;
    let total = 0;

    // Check GHS data (most important)
    total += 0.5;
    if (ghsResult.status === 'fulfilled' && ghsResult.value.classifications.length > 0) {
      quality += 0.5;
    }

    // Check properties
    total += 0.3;
    if (propertiesResult.status === 'fulfilled' && propertiesResult.value.molecularWeight) {
      quality += 0.3;
    }

    // Check synonyms
    total += 0.2;
    if (synonymsResult.status === 'fulfilled' && synonymsResult.value.length > 0) {
      quality += 0.2;
    }

    return quality / total;
  }
}

// Export singleton instance
export const pubchemAPI = new PubChemAPIService();
