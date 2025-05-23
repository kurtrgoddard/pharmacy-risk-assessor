
import { HazardAssessment } from '../types';
import { nioshService } from '../nioshService';
import { safetyInfoGenerator } from '../safetyInfoGenerator';

export class NIOSHStrategy {
  /**
   * Get assessment from static NIOSH data
   */
  async execute(ingredientName: string): Promise<HazardAssessment> {
    const nioshData = await nioshService.checkNIOSH(ingredientName);
    
    if (!nioshData) {
      throw new Error('No NIOSH data available');
    }

    return {
      ingredientName,
      normalizedName: ingredientName,
      
      hazardClassifications: {
        ghs: [],
        niosh: nioshData,
        regulatory: []
      },
      
      physicalProperties: {
        physicalForm: 'powder', // Conservative default
        solubility: 'unknown'
      },
      
      safetyInfo: safetyInfoGenerator.generateSafetyInfoFromNIOSH(nioshData),
      
      dataQuality: {
        sources: [{ name: 'NIOSH 2024', url: 'https://www.cdc.gov/niosh' }],
        confidence: 0.8,
        lastUpdated: new Date('2024-01-01'),
        warnings: ['Using static NIOSH 2024 data']
      }
    };
  }
}

export const nioshStrategy = new NIOSHStrategy();
