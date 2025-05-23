
/**
 * SDS API Service
 * Provides integration with third-party SDS data providers
 */

import { SDSData } from "@/utils/mediscaAPI";

// API configuration options
interface SDSApiConfig {
  apiKey: string;
  baseUrl: string;
  version?: string;
}

// Default configuration - replace with your selected provider
const defaultConfig: SDSApiConfig = {
  apiKey: process.env.SDS_API_KEY || "",
  baseUrl: "https://api.example-sds-provider.com", // Replace with actual provider
  version: "v1"
};

/**
 * SDS API Service class for retrieving Safety Data Sheet information
 */
export class SDSApiService {
  private config: SDSApiConfig;
  private cache: Record<string, { data: SDSData, timestamp: number }> = {};
  private cacheExpiryMs: number = 24 * 60 * 60 * 1000; // 24 hours

  constructor(config: SDSApiConfig = defaultConfig) {
    this.config = config;
  }

  /**
   * Get SDS data for an ingredient
   * @param ingredientName Name of the ingredient
   * @returns SDSData object or null if not found
   */
  async getSdsData(ingredientName: string): Promise<SDSData | null> {
    // Normalize the ingredient name
    const normalizedName = ingredientName.trim().toLowerCase();
    
    console.log(`Retrieving SDS data for ${normalizedName}...`);
    
    // Check cache first
    const cachedData = this.getCachedData(normalizedName);
    if (cachedData) {
      console.log(`Using cached SDS data for ${normalizedName}`);
      return cachedData;
    }
    
    try {
      // Make API request - implement your chosen provider's API here
      const response = await fetch(`${this.config.baseUrl}/${this.config.version}/sds?ingredient=${encodeURIComponent(normalizedName)}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`SDS API returned ${response.status}: ${response.statusText}`);
      }
      
      // Parse response - adjust based on your selected provider's response format
      const apiData = await response.json();
      
      // Transform provider's data format to our app's SDSData format
      const sdsData = this.transformApiResponse(apiData, normalizedName);
      
      // Cache the result
      this.cacheData(normalizedName, sdsData);
      
      return sdsData;
    } catch (error) {
      console.error(`Error retrieving SDS data for ${normalizedName}:`, error);
      return null;
    }
  }
  
  /**
   * Transform API response to our app's SDSData format
   * This needs to be customized based on the specific provider chosen
   */
  private transformApiResponse(apiResponse: any, ingredientName: string): SDSData {
    // This is a placeholder implementation
    // You would need to map the provider's response fields to your SDSData structure
    return {
      ingredientName,
      physicalForm: apiResponse.physicalState || apiResponse.appearance,
      hazardClassification: {
        ghs: apiResponse.ghsClassifications || [],
        whmis: apiResponse.whmisClassifications || []
      },
      recommendedPPE: {
        gloves: apiResponse.ppe?.gloves || "Not specified",
        respiratoryProtection: apiResponse.ppe?.respiratory || "Not specified",
        eyeProtection: apiResponse.ppe?.eye || "Not specified",
        bodyProtection: apiResponse.ppe?.body || "Not specified"
      },
      exposureRisks: apiResponse.hazards?.exposureRisks || [],
      handlingPrecautions: apiResponse.handling?.precautions || [],
      timestamp: Date.now()
    };
  }
  
  /**
   * Get SDS document URL
   * @param ingredientName Name of the ingredient
   * @returns URL to the SDS document
   */
  getSdsDocumentUrl(ingredientName: string): string {
    // Implement according to your chosen provider's document URL structure
    return `${this.config.baseUrl}/${this.config.version}/documents/sds?name=${encodeURIComponent(ingredientName)}`;
  }
  
  /**
   * Open SDS document in a new tab
   * @param ingredientName Name of the ingredient
   */
  openSdsDocument(ingredientName: string): void {
    try {
      const sdsUrl = this.getSdsDocumentUrl(ingredientName);
      console.log(`Opening SDS URL: ${sdsUrl}`);
      window.open(sdsUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error(`Error opening SDS for ${ingredientName}:`, error);
      throw new Error(`Could not open SDS for ${ingredientName}`);
    }
  }
  
  // Cache methods
  private getCachedData(key: string): SDSData | null {
    const cached = this.cache[key];
    if (cached && Date.now() - cached.timestamp < this.cacheExpiryMs) {
      return cached.data;
    }
    return null;
  }
  
  private cacheData(key: string, data: SDSData): void {
    this.cache[key] = { data, timestamp: Date.now() };
  }
  
  /**
   * Clear the SDS data cache
   */
  clearCache(): void {
    this.cache = {};
    console.log("SDS cache cleared");
  }
}

// Create singleton instance
export const sdsApiService = new SDSApiService();

// Export helper function for ease of use
export const getSdsData = (ingredientName: string): Promise<SDSData | null> => {
  return sdsApiService.getSdsData(ingredientName);
};

// Export helper function for opening SDS documents
export const openSdsDocument = (ingredientName: string): void => {
  sdsApiService.openSdsDocument(ingredientName);
};
