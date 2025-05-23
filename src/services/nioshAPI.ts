
/**
 * NIOSH API Service
 * Provides integration with NIOSH hazardous drug data
 */

import { NioshDrugInfo, HazardLevel } from "@/utils/nioshData";

// API configuration options
interface NioshApiConfig {
  apiKey: string;
  baseUrl: string;
  version?: string;
}

// Default configuration - replace with actual API provider
const defaultConfig: NioshApiConfig = {
  apiKey: process.env.NIOSH_API_KEY || "",
  baseUrl: "https://api.example-niosh-provider.com", // Replace with actual provider
  version: "v1"
};

/**
 * NIOSH API Service class for retrieving hazardous drug information
 */
export class NioshApiService {
  private config: NioshApiConfig;
  private cache: Record<string, { data: NioshDrugInfo, timestamp: number }> = {};
  private cacheExpiryMs: number = 7 * 24 * 60 * 60 * 1000; // 7 days

  constructor(config: NioshApiConfig = defaultConfig) {
    this.config = config;
  }

  /**
   * Get NIOSH hazard information for a drug
   * @param drugName Name of the drug
   * @returns NioshDrugInfo object
   */
  async getNioshHazardInfo(drugName: string): Promise<NioshDrugInfo> {
    // Normalize the drug name
    const normalizedName = drugName.trim().toLowerCase();
    
    console.log(`Looking up NIOSH info for: "${normalizedName}"`);
    
    // Check cache first
    const cachedData = this.getCachedData(normalizedName);
    if (cachedData) {
      console.log(`Using cached NIOSH data for ${normalizedName}`);
      return cachedData;
    }
    
    try {
      // Make API request - implement your chosen provider's API here
      const response = await fetch(`${this.config.baseUrl}/${this.config.version}/drugs?name=${encodeURIComponent(normalizedName)}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`NIOSH API returned ${response.status}: ${response.statusText}`);
      }
      
      // Parse response - adjust based on your selected provider's response format
      const apiData = await response.json();
      
      // Transform provider's data format to our app's NioshDrugInfo format
      const nioshData = this.transformApiResponse(apiData, normalizedName);
      
      // Cache the result
      this.cacheData(normalizedName, nioshData);
      
      return nioshData;
    } catch (error) {
      console.error(`Error retrieving NIOSH data for ${normalizedName}:`, error);
      
      // Return non-hazardous default if API fails
      return {
        table: null,
        hazardType: [],
        requiresSpecialHandling: false
      };
    }
  }
  
  /**
   * Transform API response to our app's NioshDrugInfo format
   * This needs to be customized based on the specific provider chosen
   */
  private transformApiResponse(apiResponse: any, drugName: string): NioshDrugInfo {
    // Example transformation - adjust based on provider's response structure
    let table: "Table 1" | "Table 2" | null = null;
    
    // Map API hazard level to our app's table structure
    if (apiResponse.hazardLevel === "High" || apiResponse.nioshTable === 1) {
      table = "Table 1";
    } else if (apiResponse.hazardLevel === "Moderate" || apiResponse.nioshTable === 2) {
      table = "Table 2";
    }
    
    return {
      table,
      hazardType: apiResponse.hazardTypes || [],
      requiresSpecialHandling: apiResponse.requiresSpecialHandling === true || table === "Table 1"
    };
  }
  
  /**
   * Get hazard level based on NIOSH table
   * @param drugInfo NIOSH drug information
   * @returns Hazard level
   */
  getHazardLevel(drugInfo: NioshDrugInfo): HazardLevel {
    if (drugInfo.table === "Table 1") {
      return "High Hazard";
    } else if (drugInfo.table === "Table 2") {
      return "Moderate Hazard";
    } else {
      return "Non-Hazardous";
    }
  }
  
  // Cache methods
  private getCachedData(key: string): NioshDrugInfo | null {
    const cached = this.cache[key];
    if (cached && Date.now() - cached.timestamp < this.cacheExpiryMs) {
      return cached.data;
    }
    return null;
  }
  
  private cacheData(key: string, data: NioshDrugInfo): void {
    this.cache[key] = { data, timestamp: Date.now() };
  }
  
  /**
   * Clear the NIOSH data cache
   */
  clearCache(): void {
    this.cache = {};
    console.log("NIOSH cache cleared");
  }
}

// Create singleton instance
export const nioshApiService = new NioshApiService();

// Export helper function for ease of use
export const getNioshHazardInfo = (drugName: string): Promise<NioshDrugInfo> => {
  return nioshApiService.getNioshHazardInfo(drugName);
};
