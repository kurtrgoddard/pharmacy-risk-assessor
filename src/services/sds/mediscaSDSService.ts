
import { dataOrchestrator } from '@/services/assessment/dataOrchestrator';
import { HazardAssessment, SDSInfo, SDSSearchResult } from '@/types/api';
import { getMediscaSdsUrls } from '@/utils/sdsUrlService';

export class MediscaSDSService {
  async getSDSInfo(ingredientName: string): Promise<SDSInfo> {
    try {
      const realData = await dataOrchestrator.getComprehensiveHazardData(ingredientName);
      
      if (realData.dataQuality.confidence > 0.7) {
        return this.transformToSDSFormat(realData);
      }
    } catch (error) {
      console.warn('Failed to get real SDS data, using mock:', error);
    }
    
    return this.generateMockSDS(ingredientName);
  }

  private transformToSDSFormat(hazardData: HazardAssessment): SDSInfo {
    return {
      productName: hazardData.ingredientName,
      casNumber: hazardData.casNumber || 'N/A',
      physicalForm: hazardData.physicalProperties.physicalForm,
      hazardClassifications: hazardData.hazardClassifications.ghs.map(ghs => ({
        category: ghs.category,
        pictogram: ghs.pictogram || 'GHS07',
        signalWord: 'Warning',
        hazardStatement: ghs.description
      })),
      ppeRequirements: hazardData.safetyInfo.ppeRequirements,
      handlingPrecautions: hazardData.safetyInfo.handlingPrecautions,
      storageRequirements: [
        'Store in a cool, dry place',
        'Keep container tightly closed',
        'Store away from incompatible materials',
        'Follow manufacturer recommendations'
      ],
      spillResponse: hazardData.safetyInfo.spillResponse,
      firstAid: {
        inhalation: 'Remove to fresh air. Seek medical attention if symptoms persist.',
        skinContact: 'Wash with soap and water. Remove contaminated clothing.',
        eyeContact: 'Flush with water for 15 minutes. Seek medical attention.',
        ingestion: 'Do not induce vomiting. Seek immediate medical attention.'
      },
      fireHazard: this.determineFireHazard(hazardData),
      sdsUrl: getMediscaSdsUrls(hazardData.ingredientName)[0]
    };
  }

  private determineFireHazard(hazardData: HazardAssessment): string {
    const hasFlammableGHS = hazardData.hazardClassifications.ghs.some(ghs =>
      ghs.description.toLowerCase().includes('flammable') ||
      ghs.description.toLowerCase().includes('combustible')
    );
    
    if (hasFlammableGHS) {
      return 'Flammable - Keep away from heat and ignition sources';
    }
    
    return 'No special fire hazards';
  }

  private generateMockSDS(ingredientName: string): SDSInfo {
    // Import the mock generation from the main API file
    const { generateMockSdsData } = require('@/utils/mediscaAPI');
    const mockSdsData = generateMockSdsData(ingredientName);
    
    return {
      productName: mockSdsData.ingredientName,
      casNumber: 'N/A',
      physicalForm: mockSdsData.physicalForm || 'powder',
      hazardClassifications: mockSdsData.hazardClassification.ghs.map(hazard => ({
        category: 'Category 2',
        pictogram: 'GHS07',
        signalWord: 'Warning',
        hazardStatement: hazard
      })),
      ppeRequirements: [
        { type: 'gloves', specification: mockSdsData.recommendedPPE.gloves },
        { type: 'eyewear', specification: mockSdsData.recommendedPPE.eyeProtection },
        { type: 'respirator', specification: mockSdsData.recommendedPPE.respiratoryProtection },
        { type: 'gown', specification: mockSdsData.recommendedPPE.bodyProtection }
      ],
      handlingPrecautions: mockSdsData.handlingPrecautions,
      storageRequirements: [
        'Store in a cool, dry place',
        'Keep container tightly closed'
      ],
      spillResponse: [
        'Absorb spill with appropriate material',
        'Clean area with appropriate cleaner'
      ],
      firstAid: {
        inhalation: 'Remove to fresh air. Seek medical attention if symptoms persist.',
        skinContact: 'Wash with soap and water. Remove contaminated clothing.',
        eyeContact: 'Flush with water for 15 minutes. Seek medical attention.',
        ingestion: 'Do not induce vomiting. Seek immediate medical attention.'
      },
      fireHazard: 'No special fire hazards',
      sdsUrl: getMediscaSdsUrls(ingredientName)[0]
    };
  }

  async searchSDS(query: string): Promise<SDSSearchResult[]> {
    try {
      const realData = await dataOrchestrator.getComprehensiveHazardData(query);
      
      if (realData && realData.dataQuality.confidence > 0.5) {
        return [{
          productName: realData.ingredientName,
          casNumber: realData.casNumber || 'N/A',
          manufacturer: 'Various',
          sdsUrl: getMediscaSdsUrls(realData.ingredientName)[0],
          lastUpdated: realData.dataQuality.lastUpdated.toISOString().split('T')[0]
        }];
      }
    } catch (error) {
      console.warn('Failed to search real SDS data:', error);
    }
    
    return this.generateMockSearchResults(query);
  }

  private generateMockSearchResults(query: string): SDSSearchResult[] {
    const mockResults = [
      {
        productName: query,
        casNumber: '123-45-6',
        manufacturer: 'Medisca',
        sdsUrl: getMediscaSdsUrls(query)[0],
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    ];
    
    return mockResults;
  }
}

export const mediscaSDSService = new MediscaSDSService();
