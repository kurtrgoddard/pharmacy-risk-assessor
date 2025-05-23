
import { HazardClassification, PPERequirement } from './types';

export class SafetyInfoGenerator {
  /**
   * Generate comprehensive safety information
   */
  generateComprehensiveSafetyInfo(
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
   * Generate safety info from NIOSH data only
   */
  generateSafetyInfoFromNIOSH(nioshData: any): any {
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
  generateSafetyInfo(
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
}

export const safetyInfoGenerator = new SafetyInfoGenerator();
