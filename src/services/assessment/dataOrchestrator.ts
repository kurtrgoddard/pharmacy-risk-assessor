
import { fallbackHandler } from '@/services/errorHandling/fallbackHandler';
import { cacheManager } from '@/services/cache/cacheManager';
import { HazardAssessment } from './types';
import { assessmentStrategies } from './assessmentStrategies';

export class DataOrchestrator {
  /**
   * Get comprehensive hazard data for an ingredient
   */
  async getComprehensiveHazardData(
    ingredientName: string,
    options?: {
      forceRefresh?: boolean;
      includeRelated?: boolean;
    }
  ): Promise<HazardAssessment> {
    const normalizedName = this.normalizeIngredientName(ingredientName);
    
    // Execute data gathering with fallback strategy
    const result = await fallbackHandler.executeWithFallback([
      {
        name: 'integrated_assessment',
        confidence: 0.9,
        operation: () => assessmentStrategies.getIntegratedAssessment(normalizedName, options)
      },
      {
        name: 'pubchem_only',
        confidence: 0.7,
        operation: () => assessmentStrategies.getPubChemOnlyAssessment(normalizedName)
      },
      {
        name: 'static_niosh',
        confidence: 0.5,
        operation: () => assessmentStrategies.getStaticNIOSHAssessment(normalizedName)
      },
      {
        name: 'conservative_default',
        confidence: 0.3,
        operation: () => assessmentStrategies.getConservativeDefault(normalizedName)
      }
    ], `Hazard assessment for ${ingredientName}`);

    // Add metadata about data quality
    const assessment = result.data;
    assessment.dataQuality.warnings = result.warning ? [result.warning] : [];
    
    return assessment;
  }

  /**
   * Normalize ingredient name for searching
   */
  private normalizeIngredientName(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\-]/g, '') // Remove special characters except hyphens
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  /**
   * Get operation statistics for monitoring
   */
  getStats() {
    return {
      operationStats: fallbackHandler.getOperationStats(),
      cacheStats: cacheManager.getStats()
    };
  }
}

// Export singleton instance
export const dataOrchestrator = new DataOrchestrator();
