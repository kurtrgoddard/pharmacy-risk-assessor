
import { HazardAssessment } from '../types';

export class DefaultStrategy {
  /**
   * Get conservative default assessment
   */
  async execute(ingredientName: string): Promise<HazardAssessment> {
    return {
      ingredientName,
      normalizedName: ingredientName,
      
      hazardClassifications: {
        ghs: [{
          code: 'DEFAULT',
          category: 'Unknown Hazard',
          description: 'Assume highest risk - data unavailable',
          source: 'System Default'
        }],
        niosh: {
          table: 1,
          category: 'Unknown - Assume Hazardous',
          isHazardous: true
        },
        regulatory: []
      },
      
      physicalProperties: {
        physicalForm: 'powder',
        solubility: 'unknown'
      },
      
      safetyInfo: {
        handlingPrecautions: [
          'Use maximum PPE including respirator',
          'Handle in certified fume hood only',
          'Minimize exposure time',
          'Double-bag all waste',
          'Decontaminate all equipment after use'
        ],
        ppeRequirements: [
          { type: 'respirator', specification: 'N95 or P100 respirator required' },
          { type: 'gloves', specification: 'Double chemotherapy-tested nitrile gloves' },
          { type: 'gown', specification: 'Disposable chemo gown with closed front' },
          { type: 'eyewear', specification: 'Safety goggles with face shield' },
          { type: 'shoe covers', specification: 'Disposable shoe covers required' }
        ],
        engineeringControls: [
          'Class II Type B2 BSC or containment isolator required',
          'Negative pressure room required',
          'CSTD required for all transfers',
          'Dedicated equipment only'
        ],
        spillResponse: [
          'Evacuate area immediately',
          'Use spill kit with appropriate PPE',
          'Double-bag all contaminated materials',
          'Decontaminate area thoroughly',
          'Document incident'
        ]
      },
      
      dataQuality: {
        sources: [{ name: 'Conservative Default', url: '' }],
        confidence: 0.1,
        lastUpdated: new Date(),
        warnings: [
          'No hazard data available - using maximum safety protocols',
          'Manual verification strongly recommended',
          'Consult safety officer before handling'
        ]
      }
    };
  }
}

export const defaultStrategy = new DefaultStrategy();
