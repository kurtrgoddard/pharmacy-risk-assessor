
import { GHSData, PhysicalProperties } from './types';

export class DataQualityAssessor {
  assessDataQuality(
    ghsResult: PromiseSettledResult<GHSData>,
    propertiesResult: PromiseSettledResult<PhysicalProperties>,
    synonymsResult: PromiseSettledResult<string[]>
  ): number {
    let quality = 0;
    let total = 0;

    // Check GHS data (most important)
    total += 0.5;
    if (ghsResult.status === 'fulfilled' && ghsResult.value.classifications.length > 0) {
      quality += 0.5;
    }

    // Check properties
    total += 0.3;
    if (propertiesResult.status === 'fulfilled' && propertiesResult.value.molecularWeight) {
      quality += 0.3;
    }

    // Check synonyms
    total += 0.2;
    if (synonymsResult.status === 'fulfilled' && synonymsResult.value.length > 0) {
      quality += 0.2;
    }

    return quality / total;
  }
}

export const dataQualityAssessor = new DataQualityAssessor();
