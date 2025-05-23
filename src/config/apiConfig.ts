
/**
 * API Configuration
 * Contains configuration for external API services
 */

/**
 * SDS API Configuration
 * Note: In a production environment, API keys should be stored securely,
 * not in client-side code. Consider using environment variables or a server-side
 * proxy to make these API calls.
 */
export const sdsApiConfig = {
  // Options for different SDS data providers
  
  // Verisk 3E API
  verisk3E: {
    name: "Verisk 3E",
    baseUrl: "https://api.3ecompany.com",
    version: "v2",
    // apiKey should be obtained from secure source
  },
  
  // ChemWatch API
  chemWatch: {
    name: "ChemWatch",
    baseUrl: "https://api.chemwatch.net",
    version: "v1",
    // apiKey should be obtained from secure source
  },
  
  // SafeTec API
  safeTec: {
    name: "SafeTec",
    baseUrl: "https://api.safetec.net",
    version: "v1",
    // apiKey should be obtained from secure source
  }
};

/**
 * NIOSH API Configuration
 */
export const nioshApiConfig = {
  // Options for different NIOSH data providers
  
  // NLM RxNorm API
  nlmRxNorm: {
    name: "NLM RxNorm",
    baseUrl: "https://rxnav.nlm.nih.gov/REST",
    requiresApiKey: false,
  },
  
  // CDC WONDER API
  cdcWonder: {
    name: "CDC WONDER",
    baseUrl: "https://wonder.cdc.gov/controller/datarequest",
    requiresApiKey: true,
    // apiKey should be obtained from secure source
  }
};

/**
 * Default API Provider Selection
 * Set your preferred provider here
 */
export const defaultProviders = {
  sdsProvider: "verisk3E",
  nioshProvider: "nlmRxNorm"
};
