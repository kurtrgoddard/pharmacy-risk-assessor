
import { toast } from "sonner";

// Multiple URL patterns to try for Medisca SDS
export const getMediscaSdsUrls = (ingredientName: string): string[] => {
  const cleanName = ingredientName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  const encodedName = encodeURIComponent(ingredientName);
  const encodedCleanName = encodeURIComponent(cleanName);
  
  return [
    `https://www.medisca.com/Pages/SdsSearch?product=${encodedName}`,
    `https://www.medisca.com/sds/${encodedCleanName}.pdf`,
    `https://www.medisca.com/documents/sds/${encodedCleanName}.pdf`,
    `https://www.medisca.com/safety-data-sheets/${encodedCleanName}`,
    `https://www.medisca.com/product/${encodedCleanName}/sds`,
    `https://www.medisca.com/products/${encodedCleanName}/safety-data-sheet`,
    `https://www.medisca.com/search?q=${encodedName}&type=sds`,
    `https://www.medisca.com/Pages/Search?query=${encodedName}&filter=sds`,
    `https://www.medisca.com/safety-data-sheets`,
    `https://pubchem.ncbi.nlm.nih.gov/compound/${encodedName}`,
    `http://www.chemspider.com/Search.aspx?q=${encodedName}`,
  ];
};

// Function to open SDS document with fallback URLs
export const openSdsDocument = (ingredientName: string): void => {
  try {
    const sdsUrls = getMediscaSdsUrls(ingredientName);
    console.log(`Attempting to open SDS for ${ingredientName} with ${sdsUrls.length} URL options`);
    
    const primaryUrl = sdsUrls[0];
    console.log(`Opening primary SDS URL: ${primaryUrl}`);
    
    const newWindow = window.open(primaryUrl, '_blank', 'noopener,noreferrer,width=1200,height=800');
    
    if (!newWindow) {
      throw new Error('Popup blocked or failed to open');
    }
    
    console.log('Alternative SDS sources if primary fails:', {
      'Medisca alternatives': sdsUrls.slice(1, 5),
      'External databases': sdsUrls.slice(-3),
      'Manual search suggestions': [
        `Search "${ingredientName}" on pubchem.ncbi.nlm.nih.gov`,
        `Search "${ingredientName} SDS" on Google`,
        `Contact your supplier for SDS documents`
      ]
    });
    
    toast.success("Opening SDS document. If the page doesn't load, check console for alternative sources.");
    
  } catch (error) {
    console.error(`Error opening SDS for ${ingredientName}:`, error);
    toast.error("Could not retrieve SDS at this time. Check console for alternative search suggestions.");
    throw new Error(`Could not open SDS for ${ingredientName}`);
  }
};
