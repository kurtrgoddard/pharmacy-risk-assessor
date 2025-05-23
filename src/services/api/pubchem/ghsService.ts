
import { pubchemHttpClient } from './httpClient';
import { GHSData, HazardClassification } from './types';

export class GHSService {
  async getGHSClassification(cid: number): Promise<GHSData> {
    try {
      const response = await pubchemHttpClient.fetchWithTimeout(
        `${pubchemHttpClient.getBaseURL()}/compound/cid/${cid}/classification/JSON`
      );

      const ghsClassifications = this.extractGHSClassifications(response);
      
      return {
        classifications: ghsClassifications,
        pictograms: this.mapToPictograms(ghsClassifications),
        signalWord: this.determineSignalWord(ghsClassifications)
      };
    } catch (error) {
      console.error('Failed to get GHS classification:', error);
      return {
        classifications: [],
        pictograms: [],
        signalWord: 'Warning' // Conservative default
      };
    }
  }

  private extractGHSClassifications(response: any): HazardClassification[] {
    const classifications: HazardClassification[] = [];
    
    if (!response.Classifications) {
      return classifications;
    }

    // Parse GHS classifications
    response.Classifications.forEach((classification: any) => {
      if (classification.Annotation?.SourceName?.includes('GHS')) {
        classifications.push({
          code: classification.Annotation.SourceID,
          category: classification.Annotation.SourceCategory,
          description: classification.Annotation.SourceValue,
          source: 'GHS'
        });
      }
    });

    return classifications;
  }

  private mapToPictograms(classifications: HazardClassification[]): string[] {
    const pictogramMap: Record<string, string> = {
      'explosive': 'GHS01',
      'flammable': 'GHS02',
      'oxidizing': 'GHS03',
      'compressed': 'GHS04',
      'corrosive': 'GHS05',
      'toxic': 'GHS06',
      'harmful': 'GHS07',
      'health hazard': 'GHS08',
      'environmental': 'GHS09'
    };

    const pictograms = new Set<string>();
    
    classifications.forEach(classification => {
      const desc = classification.description.toLowerCase();
      Object.entries(pictogramMap).forEach(([keyword, pictogram]) => {
        if (desc.includes(keyword)) {
          pictograms.add(pictogram);
        }
      });
    });

    return Array.from(pictograms);
  }

  private determineSignalWord(classifications: HazardClassification[]): 'Danger' | 'Warning' {
    // Check for high-hazard indicators
    const dangerKeywords = ['fatal', 'toxic', 'cancer', 'mutagenic', 'reproductive'];
    
    for (const classification of classifications) {
      const desc = classification.description.toLowerCase();
      if (dangerKeywords.some(keyword => desc.includes(keyword))) {
        return 'Danger';
      }
    }

    return 'Warning';
  }
}

export const ghsService = new GHSService();
