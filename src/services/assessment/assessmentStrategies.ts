
import { pubchemAPI } from '@/services/api/pubchemAPI';
import { cacheManager } from '@/services/cache/cacheManager';
import { HazardAssessment } from './types';
import { nioshService } from './nioshService';
import { safetyInfoGenerator } from './safetyInfoGenerator';
import { dataMerger } from './dataMerger';

export class AssessmentStrategies {
  /**
   * Get integrated assessment from multiple sources
   */
  async getIntegratedAssessment(
    ingredientName: string,
    options?: { forceRefresh?: boolean; includeRelated?: boolean }
  ): Promise<HazardAssessment> {
    // Check NIOSH first (highest priority)
    const nioshData = await nioshService.checkNIOSH(ingredientName);
    
    // Gather data from all sources in parallel
    const [pubchemResult, rxnormResult] = await Promise.allSettled([
      cacheManager.getOrFetch(
        `pubchem:${ingredientName}`,
        () => pubchemAPI.getComprehensiveHazardData(ingredientName),
        'pubchem',
        { forceRefresh: options?.forceRefresh }
      ),
      // RxNorm will be implemented in next phase
      Promise.resolve(null)
    ]);

    // Merge data with priority
    return dataMerger.mergeHazardData({
      ingredientName,
      niosh: nioshData,
      pubchem: pubchemResult.status === 'fulfilled' ? pubchemResult.value : null,
      rxnorm: rxnormResult.status === 'fulfilled' ? rxnormResult.value : null
    });
  }

  /**
   * Get assessment using only PubChem data
   */
  async getPubChemOnlyAssessment(ingredientName: string): Promise<HazardAssessment> {
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

  /**
   * Get assessment from static NIOSH data
   */
  async getStaticNIOSHAssessment(ingredientName: string): Promise<HazardAssessment> {
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

  /**
   * Get conservative default assessment
   */
  async getConservativeDefault(ingredientName: string): Promise<HazardAssessment> {
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

export const assessmentStrategies = new AssessmentStrategies();
