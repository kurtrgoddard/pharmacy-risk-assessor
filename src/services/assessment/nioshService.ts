
import { getNioshHazardInfo } from '@/utils/nioshData';

export class NIOSHService {
  /**
   * Check NIOSH database for hazard classification
   */
  async checkNIOSH(ingredientName: string): Promise<any> {
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
}

export const nioshService = new NIOSHService();
