
import { HazardAssessment, HazardClassification, DataSource } from './types';
import { safetyInfoGenerator } from './safetyInfoGenerator';

export class DataMerger {
  private readonly confidence = {
    niosh: 1.0,      // Highest confidence - official NIOSH data
    pubchem: 0.8,    // High confidence - comprehensive chemical database
    rxnorm: 0.7,     // Good for drug names
    dailymed: 0.7,   // Good for FDA data
    static: 0.5,     // Moderate - our static database
    mock: 0.3        // Low - generated data
  };

  /**
   * Merge hazard data from multiple sources
   */
  mergeHazardData(data: {
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
    const safetyInfo = safetyInfoGenerator.generateComprehensiveSafetyInfo(
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
}

export const dataMerger = new DataMerger();
