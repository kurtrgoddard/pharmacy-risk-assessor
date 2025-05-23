
import { pubchemAPI } from '@/services/api/pubchemAPI';
import { cacheManager } from '@/services/cache/cacheManager';
import { fallbackHandler, FallbackResult } from '@/services/errorHandling/fallbackHandler';
import { getNioshHazardInfo } from '@/utils/nioshData';

interface HazardClassification {
  code: string;
  category: string;
  description: string;
  source: string;
}

interface PPERequirement {
  type: string;
  specification: string;
}

interface DataSource {
  name: string;
  url: string;
}

interface HazardAssessment {
  ingredientName: string;
  normalizedName: string;
  casNumber?: string;
  hazardClassifications: {
    ghs: HazardClassification[];
    niosh?: any;
    regulatory: any[];
  };
  physicalProperties: {
    physicalForm: 'powder' | 'liquid' | 'solid' | 'gas';
    solubility: string;
    molecularWeight?: number;
  };
  safetyInfo: {
    handlingPrecautions: string[];
    ppeRequirements: PPERequirement[];
    engineeringControls: string[];
    spillResponse: string[];
  };
  dataQuality: {
    sources: DataSource[];
    confidence: number;
    lastUpdated: Date;
    warnings: string[];
  };
}

export class DataOrchestrator {
  private readonly confidence = {
    niosh: 1.0,      // Highest confidence - official NIOSH data
    pubchem: 0.8,    // High confidence - comprehensive chemical database
    rxnorm: 0.7,     // Good for drug names
    dailymed: 0.7,   // Good for FDA data
    static: 0.5,     // Moderate - our static database
    mock: 0.3        // Low - generated data
  };

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
        operation: () => this.getIntegratedAssessment(normalizedName, options)
      },
      {
        name: 'pubchem_only',
        confidence: 0.7,
        operation: () => this.getPubChemOnlyAssessment(normalizedName)
      },
      {
        name: 'static_niosh',
        confidence: 0.5,
        operation: () => this.getStaticNIOSHAssessment(normalizedName)
      },
      {
        name: 'conservative_default',
        confidence: 0.3,
        operation: () => this.getConservativeDefault(normalizedName)
      }
    ], `Hazard assessment for ${ingredientName}`);

    // Add metadata about data quality
    const assessment = result.data;
    assessment.dataQuality.warnings = result.warning ? [result.warning] : [];
    
    return assessment;
  }

  /**
   * Get integrated assessment from multiple sources
   */
  private async getIntegratedAssessment(
    ingredientName: string,
    options?: { forceRefresh?: boolean; includeRelated?: boolean }
  ): Promise<HazardAssessment> {
    // Check NIOSH first (highest priority)
    const nioshData = await this.checkNIOSH(ingredientName);
    
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
    return this.mergeHazardData({
      ingredientName,
      niosh: nioshData,
      pubchem: pubchemResult.status === 'fulfilled' ? pubchemResult.value : null,
      rxnorm: rxnormResult.status === 'fulfilled' ? rxnormResult.value : null
    });
  }

  /**
   * Get assessment using only PubChem data
   */
  private async getPubChemOnlyAssessment(ingredientName: string): Promise<HazardAssessment> {
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
      
      safetyInfo: this.generateSafetyInfo(
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
  private async getStaticNIOSHAssessment(ingredientName: string): Promise<HazardAssessment> {
    const nioshData = await this.checkNIOSH(ingredientName);
    
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
      
      safetyInfo: this.generateSafetyInfoFromNIOSH(nioshData),
      
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
  private async getConservativeDefault(ingredientName: string): Promise<HazardAssessment> {
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

  /**
   * Check NIOSH database for hazard classification
   */
  private async checkNIOSH(ingredientName: string): Promise<any> {
    const nioshInfo = getNioshHazardInfo(ingredientName);
    
    if (nioshInfo.table) {
      return {
        table: nioshInfo.table === 'Table 1' ? 1 : 2,
        category: nioshInfo.hazardType.join(', '),
        isHazardous: nioshInfo.requiresSpecialHandling,
        hasReproductiveToxicity: nioshInfo.hazardType.some(type => 
          type.toLowerCase().includes('reproductive')
        ),
        isCarcinogenic: nioshInfo.hazardType.some(type => 
          type.toLowerCase().includes('carcinogen')
        )
      };
    }
    
    return null;
  }

  /**
   * Merge hazard data from multiple sources
   */
  private mergeHazardData(data: {
    ingredientName: string;
    niosh: any;
    pubchem: any;
    rxnorm: any;
  }): HazardAssessment {
    const sources: DataSource[] = [];
    const warnings: string[] = [];
    let totalConfidence = 0;
    let confidenceCount = 0;

    // Collect GHS classifications
    const ghsClassifications: HazardClassification[] = [];
    
    if (data.pubchem?.ghs?.classifications) {
      ghsClassifications.push(...data.pubchem.ghs.classifications);
      sources.push({ name: 'PubChem', url: 'https://pubchem.ncbi.nlm.nih.gov' });
      totalConfidence += this.confidence.pubchem;
      confidenceCount++;
    }

    // Add NIOSH data if available
    let nioshClassification = data.niosh;
    if (nioshClassification) {
      sources.push({ name: 'NIOSH 2024', url: 'https://www.cdc.gov/niosh' });
      totalConfidence += this.confidence.niosh;
      confidenceCount++;
    }

    // Determine physical properties (prefer PubChem data)
    const physicalProperties = data.pubchem?.properties || {
      physicalForm: 'powder' as const, // Conservative default
      solubility: 'unknown'
    };

    // Generate safety info based on highest risk data
    const safetyInfo = this.generateComprehensiveSafetyInfo(
      ghsClassifications,
      nioshClassification,
      physicalProperties.physicalForm
    );

    // Calculate average confidence
    const avgConfidence = confidenceCount > 0 ? totalConfidence / confidenceCount : 0.1;

    return {
      ingredientName: data.ingredientName,
      normalizedName: data.pubchem?.compound?.IUPACName || data.ingredientName,
      casNumber: data.pubchem?.compound?.CID?.toString(),
      
      hazardClassifications: {
        ghs: ghsClassifications,
        niosh: nioshClassification,
        regulatory: []
      },
      
      physicalProperties,
      
      safetyInfo,
      
      dataQuality: {
        sources,
        confidence: avgConfidence,
        lastUpdated: new Date(),
        warnings
      }
    };
  }

  /**
   * Generate comprehensive safety information
   */
  private generateComprehensiveSafetyInfo(
    ghsClassifications: HazardClassification[],
    nioshData: any,
    physicalForm: string
  ): any {
    // Start with base safety requirements
    let ppeLevel: 'basic' | 'enhanced' | 'maximum' = 'basic';
    let engineeringLevel: 'basic' | 'enhanced' | 'maximum' = 'basic';

    // Check NIOSH classification (highest priority)
    if (nioshData) {
      if (nioshData.table === 1) {
        ppeLevel = 'maximum';
        engineeringLevel = 'maximum';
      } else if (nioshData.table === 2) {
        ppeLevel = 'enhanced';
        engineeringLevel = 'enhanced';
      }
    }

    // Check GHS classifications
    const hasHighHazard = ghsClassifications.some(c => 
      c.description.toLowerCase().includes('fatal') ||
      c.description.toLowerCase().includes('toxic') ||
      c.description.toLowerCase().includes('cancer') ||
      c.description.toLowerCase().includes('reproductive')
    );

    if (hasHighHazard) {
      ppeLevel = 'maximum';
      engineeringLevel = 'maximum';
    }

    // Powder form requires enhanced minimum
    if (physicalForm === 'powder' && ppeLevel === 'basic') {
      ppeLevel = 'enhanced';
      engineeringLevel = 'enhanced';
    }

    return {
      handlingPrecautions: this.getHandlingPrecautions(ppeLevel),
      ppeRequirements: this.getPPERequirements(ppeLevel),
      engineeringControls: this.getEngineeringControls(engineeringLevel),
      spillResponse: this.getSpillResponse(ppeLevel)
    };
  }

  /**
   * Get handling precautions based on risk level
   */
  private getHandlingPrecautions(level: 'basic' | 'enhanced' | 'maximum'): string[] {
    const basic = [
      'Wash hands thoroughly after handling',
      'Avoid contact with eyes and skin',
      'Use in well-ventilated area'
    ];

    const enhanced = [
      ...basic,
      'Minimize dust generation',
      'Use dedicated equipment',
      'Decontaminate work surfaces after use'
    ];

    const maximum = [
      ...enhanced,
      'Use closed-system drug transfer devices',
      'Double-bag all waste',
      'Shower and change clothes after handling',
      'Monitor for exposure symptoms'
    ];

    switch (level) {
      case 'basic': return basic;
      case 'enhanced': return enhanced;
      case 'maximum': return maximum;
    }
  }

  /**
   * Get PPE requirements based on risk level
   */
  private getPPERequirements(level: 'basic' | 'enhanced' | 'maximum'): PPERequirement[] {
    const basic: PPERequirement[] = [
      { type: 'gloves', specification: 'Nitrile gloves' },
      { type: 'eyewear', specification: 'Safety glasses' }
    ];

    const enhanced: PPERequirement[] = [
      { type: 'gloves', specification: 'Double nitrile gloves' },
      { type: 'eyewear', specification: 'Safety goggles' },
      { type: 'gown', specification: 'Lab coat or disposable gown' },
      { type: 'respirator', specification: 'N95 respirator for powder handling' }
    ];

    const maximum: PPERequirement[] = [
      { type: 'gloves', specification: 'Double chemotherapy-tested nitrile gloves' },
      { type: 'eyewear', specification: 'Safety goggles with face shield' },
      { type: 'gown', specification: 'Disposable chemo gown with closed front' },
      { type: 'respirator', specification: 'N95 or P100 respirator' },
      { type: 'shoe covers', specification: 'Disposable shoe covers' },
      { type: 'hair cover', specification: 'Disposible hair cover' }
    ];

    switch (level) {
      case 'basic': return basic;
      case 'enhanced': return enhanced;
      case 'maximum': return maximum;
    }
  }

  /**
   * Get engineering controls based on risk level
   */
  private getEngineeringControls(level: 'basic' | 'enhanced' | 'maximum'): string[] {
    const basic = [
      'Good general ventilation',
      'Eye wash station available'
    ];

    const enhanced = [
      'Fume hood or powder containment hood',
      'Dedicated work area',
      'Spill kit readily available'
    ];

    const maximum = [
      'Class II Type B2 BSC or containment isolator',
      'Negative pressure room',
      'HEPA-filtered exhaust',
      'Dedicated HVAC system',
      'Continuous air monitoring'
    ];

    switch (level) {
      case 'basic': return basic;
      case 'enhanced': return enhanced;
      case 'maximum': return maximum;
    }
  }

  /**
   * Get spill response procedures
   */
  private getSpillResponse(level: 'basic' | 'enhanced' | 'maximum'): string[] {
    const basic = [
      'Absorb spill with appropriate material',
      'Clean area with appropriate cleaner',
      'Dispose of waste properly'
    ];

    const enhanced = [
      'Alert others in area',
      'Don appropriate PPE before cleanup',
      ...basic,
      'Decontaminate area after cleanup'
    ];

    const maximum = [
      'Evacuate immediate area',
      'Post warning signs',
      'Don maximum PPE including respirator',
      'Use certified spill kit',
      'Double-bag all contaminated materials',
      'Decontaminate area multiple times',
      'Document incident and notify safety officer'
    ];

    switch (level) {
      case 'basic': return basic;
      case 'enhanced': return enhanced;
      case 'maximum': return maximum;
    }
  }

  /**
   * Generate safety info from NIOSH data only
   */
  private generateSafetyInfoFromNIOSH(nioshData: any): any {
    const level = nioshData.table === 1 ? 'maximum' : 'enhanced';
    
    return {
      handlingPrecautions: this.getHandlingPrecautions(level),
      ppeRequirements: this.getPPERequirements(level),
      engineeringControls: this.getEngineeringControls(level),
      spillResponse: this.getSpillResponse(level)
    };
  }

  /**
   * Generate safety info from GHS classifications
   */
  private generateSafetyInfo(
    ghsClassifications: HazardClassification[],
    physicalForm: string
  ): any {
    const hasHighHazard = ghsClassifications.some(c => 
      c.description.toLowerCase().includes('fatal') ||
      c.description.toLowerCase().includes('toxic') ||
      c.description.toLowerCase().includes('cancer')
    );

    const level = hasHighHazard ? 'maximum' : 
                  physicalForm === 'powder' ? 'enhanced' : 'basic';

    return {
      handlingPrecautions: this.getHandlingPrecautions(level),
      ppeRequirements: this.getPPERequirements(level),
      engineeringControls: this.getEngineeringControls(level),
      spillResponse: this.getSpillResponse(level)
    };
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
