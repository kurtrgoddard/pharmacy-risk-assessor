
import { toast } from "sonner";

// Validated working URL patterns
export const getMediscaSdsUrls = (ingredientName: string): string[] => {
  const cleanName = ingredientName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '+');
  
  const encodedName = encodeURIComponent(ingredientName);
  
  return [
    // Fixed PubChem search URL (compound search, not direct compound page)
    `https://pubchem.ncbi.nlm.nih.gov/compound?q=${encodedName}`,
    // ChemIDplus search
    `https://chem.nlm.nih.gov/chemidplus/name/${encodedName}`,
    // EPA CompTox Dashboard search
    `https://comptox.epa.gov/dashboard/chemical/search?search=${encodedName}`,
    // Google search for SDS documents
    `https://www.google.com/search?q="${encodedName}"+SDS+safety+data+sheet+filetype:pdf`,
    // Alternative chemical suppliers
    `https://www.sigmaaldrich.com/CA/en/search/${encodedName}?focus=products&page=1&perpage=30&sort=relevance&term=${encodedName}&type=product`,
    `https://www.fishersci.com/us/en/catalog/search/products?keyword=${encodedName}`,
  ];
};

// Function to validate URL accessibility (basic check)
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Function to open SDS document with validated URLs
export const openSdsDocument = (ingredientName: string): void => {
  try {
    const sdsUrls = getMediscaSdsUrls(ingredientName);
    console.log(`Opening SDS search for ${ingredientName}`);
    
    // Use the validated PubChem search URL
    const primaryUrl = sdsUrls[0];
    
    // Validate URL before opening
    if (!isValidUrl(primaryUrl)) {
      throw new Error('Invalid URL generated');
    }
    
    console.log(`Primary SDS search URL: ${primaryUrl}`);
    
    // Try to open in new tab with better popup handling
    const newWindow = window.open('', '_blank');
    
    if (newWindow) {
      newWindow.location.href = primaryUrl;
      console.log('SDS search opened successfully');
      
      // Log alternative sources for manual searching
      console.log('Alternative SDS sources:', {
        'ChemIDplus Search': sdsUrls[1],
        'EPA CompTox Search': sdsUrls[2],
        'Google SDS Search': sdsUrls[3],
        'Sigma-Aldrich Search': sdsUrls[4],
        'Fisher Scientific Search': sdsUrls[5]
      });
      
      toast.success(`Opening chemical database search for ${ingredientName}. Multiple search options available in console.`);
    } else {
      throw new Error('Popup blocked');
    }
    
  } catch (error) {
    console.error(`Error opening SDS search for ${ingredientName}:`, error);
    
    // Provide validated fallback URLs
    const fallbackUrls = [
      `https://pubchem.ncbi.nlm.nih.gov/compound?q=${encodeURIComponent(ingredientName)}`,
      `https://www.google.com/search?q="${encodeURIComponent(ingredientName)}"+SDS+safety+data+sheet`
    ];
    
    console.log(`Manual SDS search options for ${ingredientName}:`, fallbackUrls);
    
    // Show helpful message with manual instructions
    toast.error(`Popup blocked. Search manually: "${ingredientName} SDS" on PubChem or Google`, {
      duration: 8000,
    });
    
    // Log search guidance
    console.log(`Manual search guidance for ${ingredientName}:`, {
      'PubChem Search': fallbackUrls[0],
      'Google Search': fallbackUrls[1],
      'Search terms': [
        `"${ingredientName} safety data sheet"`,
        `"${ingredientName} SDS"`,
        `"${ingredientName} MSDS"`
      ]
    });
  }
};
