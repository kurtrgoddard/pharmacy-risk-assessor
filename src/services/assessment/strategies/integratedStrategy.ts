
import { pubchemAPI } from '@/services/api/pubchemAPI';
import { cacheManager } from '@/services/cache/cacheManager';
import { HazardAssessment } from '../types';
import { nioshService } from '../nioshService';
import { dataMerger } from '../dataMerger';

export class IntegratedStrategy {
  /**
   * Get integrated assessment from multiple sources
   */
  async execute(
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
}

export const integratedStrategy = new IntegratedStrategy();
