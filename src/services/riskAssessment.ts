
// services/riskAssessment.ts - Updated version
import { dataOrchestrator } from '@/services/assessment/dataOrchestrator';
import { fallbackHandler } from '@/services/errorHandling/fallbackHandler';
import { 
  CompoundFormulation, 
  RiskAssessment, 
  RiskLevel, 
  IngredientAssessment,
  PPERequirement,
  HazardAssessment 
} from '@/types/api';

export class RiskAssessmentService {
  /**
   * Assess a compound formulation using real API data
   */
  async assessCompound(compound: CompoundFormulation): Promise<RiskAssessment> {
    console.log(`Starting risk assessment for: ${compound.name}`);
    
    // Assess each ingredient in parallel
    const ingredientAssessments = await this.assessIngredients(compound.ingredients);
    
    // Calculate overall risk level
    const overallRiskLevel = this.calculateOverallRiskLevel(ingredientAssessments);
    
    // Determine required PPE and controls
    const { requiredPPE, requiredControls } = this.determineRequirements(
      ingredientAssessments,
      overallRiskLevel
    );
    
    // Generate additional precautions
    const additionalPrecautions = this.generateAdditionalPrecautions(
      compound,
      ingredientAssessments,
      overallRiskLevel
    );
    
    return {
      compound,
      overallRiskLevel,
      ingredientAssessments,
      requiredPPE,
      requiredControls,
      additionalPrecautions,
      assessmentDate: new Date(),
      reviewRequired: this.isReviewRequired(ingredientAssessments),
      expiryDate: this.calculateExpiryDate(ingredientAssessments)
    };
  }

  /**
   * Assess individual ingredients
   */
  private async assessIngredients(
    ingredients: CompoundFormulation['ingredients']
  ): Promise<IngredientAssessment[]> {
    const assessmentPromises = ingredients.map(async (ingredient) => {
      try {
        // Get hazard data with fallback
        const hazardData = await dataOrchestrator.getComprehensiveHazardData(
          ingredient.name,
          { includeRelated: true }
        );
        
        // Determine contribution to risk
        const contributionToRisk = this.assessContributionToRisk(
          hazardData,
          ingredient.percentage || 0
        );
        
        // Identify specific concerns
        const specificConcerns = this.identifySpecificConcerns(hazardData, ingredient);
        
        return {
          ingredient,
          hazardData,
          contributionToRisk,
          specificConcerns
        };
      } catch (error) {
        console.error(`Failed to assess ingredient ${ingredient.name}:`, error);
        
        // Return conservative assessment on failure
        return {
          ingredient,
          hazardData: await this.getConservativeHazardData(ingredient.name),
          contributionToRisk: 'high' as const,
          specificConcerns: ['Unable to retrieve complete hazard data - assuming highest risk']
        };
      }
    });
    
    return Promise.all(assessmentPromises);
  }

  /**
   * Calculate overall risk level based on ingredient assessments
   */
  private calculateOverallRiskLevel(assessments: IngredientAssessment[]): RiskLevel {
    // Check for any Level C indicators
    const hasLevelCIndicator = assessments.some(assessment => {
      const { hazardData } = assessment;
      
      // NIOSH Table 1 = automatic Level C
      if (hazardData.hazardClassifications.niosh?.table === 1) {
        return true;
      }
      
      // Reproductive toxicity = Level C
      if (hazardData.hazardClassifications.niosh?.hasReproductiveToxicity) {
        return true;
      }
      
      // Carcinogenic = Level C
      if (hazardData.hazardClassifications.niosh?.isCarcinogenic) {
        return true;
      }
      
      // High-risk GHS classifications
      const hasHighRiskGHS = hazardData.hazardClassifications.ghs.some(ghs =>
        ghs.description.toLowerCase().includes('fatal') ||
        ghs.description.toLowerCase().includes('cancer') ||
        ghs.description.toLowerCase().includes('mutagenic') ||
        ghs.description.toLowerCase().includes('reproductive')
      );
      
      return hasHighRiskGHS;
    });
    
    if (hasLevelCIndicator) {
      return 'C';
    }
    
    // Check for Level B indicators
    const hasLevelBIndicator = assessments.some(assessment => {
      const { hazardData } = assessment;
      
      // NIOSH Table 2 = Level B minimum
      if (hazardData.hazardClassifications.niosh?.table === 2) {
        return true;
      }
      
      // Powder form = Level B minimum
      if (hazardData.physicalProperties.physicalForm === 'powder') {
        return true;
      }
      
      // Multiple hazardous ingredients
      const hazardousCount = assessments.filter(a => 
        a.hazardData.hazardClassifications.niosh?.isHazardous ||
        a.hazardData.hazardClassifications.ghs.length > 0
      ).length;
      
      return hazardousCount > 1;
    });
    
    if (hasLevelBIndicator) {
      return 'B';
    }
    
    // Low confidence data = Level B minimum
    const hasLowConfidenceData = assessments.some(
      a => a.hazardData.dataQuality.confidence < 0.5
    );
    
    if (hasLowConfidenceData) {
      return 'B';
    }
    
    // Default to Level A for simple, well-understood compounds
    return 'A';
  }

  /**
   * Determine required PPE and engineering controls
   */
  private determineRequirements(
    assessments: IngredientAssessment[],
    overallRiskLevel: RiskLevel
  ): { requiredPPE: PPERequirement[]; requiredControls: string[] } {
    // Start with base requirements for risk level
    let requiredPPE: PPERequirement[] = [];
    let requiredControls: string[] = [];
    
    // Aggregate all PPE requirements
    const allPPE = new Map<string, PPERequirement>();
    const allControls = new Set<string>();
    
    assessments.forEach(assessment => {
      assessment.hazardData.safetyInfo.ppeRequirements.forEach(ppe => {
        const existing = allPPE.get(ppe.type);
        if (!existing || this.isHigherPPE(ppe, existing)) {
          allPPE.set(ppe.type, ppe);
        }
      });
      
      assessment.hazardData.safetyInfo.engineeringControls.forEach(control => {
        allControls.add(control);
      });
    });
    
    requiredPPE = Array.from(allPPE.values());
    requiredControls = Array.from(allControls);
    
    // Ensure minimum requirements based on risk level
    const minimumPPE = this.getMinimumPPE(overallRiskLevel);
    const minimumControls = this.getMinimumControls(overallRiskLevel);
    
    // Merge with minimums
    minimumPPE.forEach(minPPE => {
      if (!requiredPPE.some(ppe => ppe.type === minPPE.type)) {
        requiredPPE.push(minPPE);
      }
    });
    
    minimumControls.forEach(control => {
      if (!requiredControls.includes(control)) {
        requiredControls.push(control);
      }
    });
    
    return { requiredPPE, requiredControls };
  }

  /**
   * Generate additional precautions based on specific compound characteristics
   */
  private generateAdditionalPrecautions(
    compound: CompoundFormulation,
    assessments: IngredientAssessment[],
    riskLevel: RiskLevel
  ): string[] {
    const precautions: string[] = [];
    
    // Check for specific formulation concerns
    if (compound.dosageForm.toLowerCase().includes('cream') || 
        compound.dosageForm.toLowerCase().includes('ointment')) {
      precautions.push('Use appropriate mixing equipment to minimize aerosolization');
    }
    
    // Check for incompatibilities
    const incompatibilities = this.checkIncompatibilities(assessments);
    if (incompatibilities.length > 0) {
      precautions.push(...incompatibilities);
    }
    
    // Add precautions for low data quality
    const lowQualityIngredients = assessments.filter(
      a => a.hazardData.dataQuality.confidence < 0.5
    );
    
    if (lowQualityIngredients.length > 0) {
      precautions.push(
        `Limited hazard data available for: ${lowQualityIngredients
          .map(a => a.ingredient.name)
          .join(', ')}. Exercise additional caution.`
      );
    }
    
    // Add quantity-based precautions
    if (compound.totalQuantity > 1000) {
      precautions.push('Large batch size - ensure adequate ventilation and breaks during preparation');
    }
    
    // Risk level specific precautions
    if (riskLevel === 'C') {
      precautions.push(
        'Level C compound - requires specialized training',
        'Pregnant or nursing staff should not handle this compound',
        'Maintain detailed exposure records'
      );
    }
    
    return precautions;
  }

  /**
   * Helper methods
   */
  private assessContributionToRisk(
    hazardData: HazardAssessment,
    percentage: number
  ): 'high' | 'medium' | 'low' {
    // High hazard classification = high contribution regardless of percentage
    if (hazardData.hazardClassifications.niosh?.table === 1) {
      return 'high';
    }
    
    // Consider both hazard level and concentration
    const hasSignificantHazard = 
      hazardData.hazardClassifications.niosh?.isHazardous ||
      hazardData.hazardClassifications.ghs.some(g => 
        g.description.toLowerCase().includes('toxic') ||
        g.description.toLowerCase().includes('harmful')
      );
    
    if (hasSignificantHazard) {
      if (percentage > 10) return 'high';
      if (percentage > 1) return 'medium';
      return 'low';
    }
    
    // Low hazard ingredients
    if (percentage > 50) return 'medium';
    return 'low';
  }

  private identifySpecificConcerns(
    hazardData: HazardAssessment,
    ingredient: CompoundFormulation['ingredients'][0]
  ): string[] {
    const concerns: string[] = [];
    
    // Check for powder concerns
    if (hazardData.physicalProperties.physicalForm === 'powder') {
      concerns.push('Powder form - risk of inhalation exposure');
    }
    
    // Check for specific hazard warnings
    hazardData.hazardClassifications.ghs.forEach(ghs => {
      if (ghs.description.toLowerCase().includes('skin')) {
        concerns.push('Skin sensitizer/irritant - ensure proper glove selection');
      }
      if (ghs.description.toLowerCase().includes('eye')) {
        concerns.push('Eye irritant - face shield recommended');
      }
      if (ghs.description.toLowerCase().includes('respiratory')) {
        concerns.push('Respiratory hazard - ensure proper ventilation');
      }
    });
    
    // Check for high concentration
    if ((ingredient.percentage || 0) > 25) {
      concerns.push(`High concentration (${ingredient.percentage}%) - increased exposure risk`);
    }
    
    // Add data quality concerns
    if (hazardData.dataQuality.warnings && hazardData.dataQuality.warnings.length > 0) {
      concerns.push(...hazardData.dataQuality.warnings);
    }
    
    return concerns;
  }

  private isHigherPPE(ppe1: PPERequirement, ppe2: PPERequirement): boolean {
    // Simple hierarchy for PPE specifications
    const hierarchy: Record<string, string[]> = {
      gloves: ['Nitrile gloves', 'Double nitrile gloves', 'Double chemotherapy-tested nitrile gloves'],
      eyewear: ['Safety glasses', 'Safety goggles', 'Safety goggles with face shield'],
      respirator: ['Surgical mask', 'N95 respirator', 'P100 respirator'],
      gown: ['Lab coat', 'Disposable gown', 'Disposible chemo gown with closed front']
    };
    
    const list = hierarchy[ppe1.type];
    if (!list) return false;
    
    const index1 = list.findIndex(spec => ppe1.specification.includes(spec));
    const index2 = list.findIndex(spec => ppe2.specification.includes(spec));
    
    return index1 > index2;
  }

  private getMinimumPPE(riskLevel: RiskLevel): PPERequirement[] {
    const requirements: Record<RiskLevel, PPERequirement[]> = {
      A: [
        { type: 'gloves', specification: 'Nitrile gloves' },
        { type: 'eyewear', specification: 'Safety glasses' }
      ],
      B: [
        { type: 'gloves', specification: 'Double nitrile gloves' },
        { type: 'eyewear', specification: 'Safety goggles' },
        { type: 'gown', specification: 'Disposable gown' }
      ],
      C: [
        { type: 'gloves', specification: 'Double chemotherapy-tested nitrile gloves' },
        { type: 'eyewear', specification: 'Safety goggles with face shield' },
        { type: 'gown', specification: 'Disposable chemo gown with closed front' },
        { type: 'respirator', specification: 'N95 respirator minimum' }
      ]
    };
    
    return requirements[riskLevel];
  }

  private getMinimumControls(riskLevel: RiskLevel): string[] {
    const controls: Record<RiskLevel, string[]> = {
      A: ['Good general ventilation'],
      B: ['Dedicated compounding area', 'Powder containment hood or BSC'],
      C: [
        'Class II Type B2 BSC or containment isolator',
        'Negative pressure room',
        'Closed system drug transfer devices'
      ]
    };
    
    return controls[riskLevel];
  }

  private checkIncompatibilities(assessments: IngredientAssessment[]): string[] {
    const incompatibilities: string[] = [];
    
    // Check for known incompatibilities
    // This would be expanded with a comprehensive incompatibility database
    const ingredients = assessments.map(a => a.ingredient.name.toLowerCase());
    
    if (ingredients.includes('tretinoin') && ingredients.includes('benzoyl peroxide')) {
      incompatibilities.push('Warning: Tretinoin and benzoyl peroxide may be incompatible - prepare separately');
    }
    
    return incompatibilities;
  }

  private isReviewRequired(assessments: IngredientAssessment[]): boolean {
    return assessments.some(a => 
      a.hazardData.dataQuality.confidence < 0.5 ||
      a.hazardData.dataQuality.verificationRequired ||
      a.contributionToRisk === 'high'
    );
  }

  private calculateExpiryDate(assessments: IngredientAssessment[]): Date {
    // Assessment validity based on data quality
    const lowestConfidence = Math.min(
      ...assessments.map(a => a.hazardData.dataQuality.confidence)
    );
    
    const expiryDate = new Date();
    
    if (lowestConfidence < 0.3) {
      expiryDate.setDate(expiryDate.getDate() + 30); // 30 days
    } else if (lowestConfidence < 0.7) {
      expiryDate.setDate(expiryDate.getDate() + 90); // 90 days
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year
    }
    
    return expiryDate;
  }

  private async getConservativeHazardData(ingredientName: string): Promise<HazardAssessment> {
    return dataOrchestrator.getComprehensiveHazardData(ingredientName, {
      forceRefresh: false
    });
  }
}

// Export singleton instance
export const riskAssessmentService = new RiskAssessmentService();
