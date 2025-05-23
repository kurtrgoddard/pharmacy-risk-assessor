
import { compoundService } from './pubchem/compoundService';
import { ghsService } from './pubchem/ghsService';
import { propertiesService } from './pubchem/propertiesService';
import { dataQualityAssessor } from './pubchem/dataQuality';
import { PubChemCompound, GHSData, PhysicalProperties } from './pubchem/types';

export class PubChemAPIService {
  async searchCompound(name: string): Promise<PubChemCompound | null> {
    return compoundService.searchCompound(name);
  }

  async getGHSClassification(cid: number): Promise<GHSData> {
    return ghsService.getGHSClassification(cid);
  }

  async getPhysicalProperties(cid: number): Promise<PhysicalProperties> {
    return propertiesService.getPhysicalProperties(cid);
  }

  async getSynonyms(cid: number): Promise<string[]> {
    return compoundService.getSynonyms(cid);
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
      dataQuality: dataQualityAssessor.assessDataQuality(ghsData, properties, synonyms)
    };
  }
}

// Export singleton instance
export const pubchemAPI = new PubChemAPIService();

// Re-export types for backward compatibility
export type { PubChemCompound, GHSData, PhysicalProperties } from './pubchem/types';
