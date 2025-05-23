
/**
 * Provides safe default values when no actual data is available
 */
export class SafeDefaults {
  /**
   * Get safe default values based on context
   */
  static getSafeDefault<T>(context: string): T {
    // Define safe defaults for different contexts
    const safeDefaults: Record<string, any> = {
      'hazard_assessment': {
        ingredientName: 'Unknown',
        riskLevel: 'C', // Highest risk level
        hazardClassifications: {
          ghs: [{
            code: 'DEFAULT',
            category: 'Unknown Hazard',
            description: 'Hazard data unavailable - assume highest risk',
            source: 'System Default'
          }],
          niosh: {
            table: 1,
            category: 'Unknown - Assume Hazardous'
          }
        },
        safetyInfo: {
          handlingPrecautions: [
            'Use maximum PPE including respirator',
            'Handle in certified fume hood only',
            'Minimize exposure time',
            'Consult safety officer before handling'
          ],
          ppeRequirements: [
            { type: 'respirator', specification: 'N95 or higher' },
            { type: 'gloves', specification: 'Double nitrile gloves' },
            { type: 'gown', specification: 'Disposable chemotherapy gown' },
            { type: 'eyewear', specification: 'Safety goggles with face shield' }
          ],
          engineeringControls: [
            'Biological safety cabinet or fume hood required',
            'Negative pressure room recommended',
            'Closed system drug transfer devices required'
          ]
        },
        dataQuality: {
          sources: ['safe_default'],
          confidence: 0.1,
          lastUpdated: new Date(),
          warnings: ['No data available - using maximum safety protocols']
        }
      },
      
      'physical_properties': {
        physicalForm: 'powder', // Most hazardous form
        solubility: 'unknown',
        molecularWeight: null
      },
      
      'risk_level': 'C', // Always default to highest risk
      
      'ppe_requirements': [
        { type: 'respirator', specification: 'N95 minimum' },
        { type: 'gloves', specification: 'Double gloves required' },
        { type: 'gown', specification: 'Protective gown required' },
        { type: 'eyewear', specification: 'Safety glasses minimum' }
      ]
    };

    // Extract base context (remove specific details)
    const baseContext = context.toLowerCase().split(' ').find(word => 
      Object.keys(safeDefaults).some(key => word.includes(key.split('_')[0]))
    ) || 'hazard_assessment';

    const defaultKey = Object.keys(safeDefaults).find(key => 
      baseContext.includes(key.split('_')[0])
    ) || 'hazard_assessment';

    return safeDefaults[defaultKey] as T;
  }
}
