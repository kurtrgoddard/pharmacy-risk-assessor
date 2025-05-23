
import { HazardAssessment } from './types';
import { integratedStrategy } from './strategies/integratedStrategy';
import { pubchemStrategy } from './strategies/pubchemStrategy';
import { nioshStrategy } from './strategies/nioshStrategy';
import { defaultStrategy } from './strategies/defaultStrategy';

export class AssessmentStrategies {
  /**
   * Get integrated assessment from multiple sources
   */
  async getIntegratedAssessment(
    ingredientName: string,
    options?: { forceRefresh?: boolean; includeRelated?: boolean }
  ): Promise<HazardAssessment> {
    return integratedStrategy.execute(ingredientName, options);
  }

  /**
   * Get assessment using only PubChem data
   */
  async getPubChemOnlyAssessment(ingredientName: string): Promise<HazardAssessment> {
    return pubchemStrategy.execute(ingredientName);
  }

  /**
   * Get assessment from static NIOSH data
   */
  async getStaticNIOSHAssessment(ingredientName: string): Promise<HazardAssessment> {
    return nioshStrategy.execute(ingredientName);
  }

  /**
   * Get conservative default assessment
   */
  async getConservativeDefault(ingredientName: string): Promise<HazardAssessment> {
    return defaultStrategy.execute(ingredientName);
  }
}

export const assessmentStrategies = new AssessmentStrategies();
