
import { pubchemAPI } from '@/services/api/pubchemAPI';
import { HazardAssessment } from '../types';
import { safetyInfoGenerator } from '../safetyInfoGenerator';

export class PubChemStrategy {
  /**
   * Get assessment using only PubChem data
   */
  async execute(ingredientName: string): Promise<HazardAssessment> {
    const pubchemData = await pubchemAPI.getComprehensiveHazardData(ingredientName);
    
    if (!pubchemData) {
      throw new Error('PubChem data not available');
    }

    return {
      ingredientName,
      normalizedName: ingredientName,
      casNumber: pubchemData.compound?.CID?.toString(),
      
      hazardClassifications: {
        ghs: pubchemData.ghs?.classifications || [],
        niosh: undefined,
        regulatory: []
      },
      
      physicalProperties: pubchemData.properties || {
        physicalForm: 'powder',
        solubility: 'unknown'
      },
      
      safetyInfo: safetyInfoGenerator.generateSafetyInfo(
        pubchemData.ghs?.classifications || [],
        pubchemData.properties?.physicalForm || 'powder'
      ),
      
      dataQuality: {
        sources: [{ name: 'PubChem', url: 'https://pubchem.ncbi.nlm.nih.gov' }],
        confidence: pubchemData.dataQuality || 0.7,
        lastUpdated: new Date(),
        warnings: []
      }
    };
  }
}

export const pubchemStrategy = new PubChemStrategy();
