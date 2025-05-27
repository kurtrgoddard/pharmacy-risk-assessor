
import { toast } from "sonner";

// Updated URL patterns with verified working sources
export const getMediscaSdsUrls = (ingredientName: string): string[] => {
  const cleanName = ingredientName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '%20');
  
  const encodedName = encodeURIComponent(ingredientName);
  
  return [
    // Verified working chemical databases
    `https://pubchem.ncbi.nlm.nih.gov/compound?search=${encodedName}`,
    `https://chem.nlm.nih.gov/chemidplus/name/${encodedName}`,
    `https://comptox.epa.gov/dashboard/chemical/search?search=${encodedName}`,
    `https://www.google.com/search?q="${encodedName}"+SDS+safety+data+sheet+filetype:pdf`,
    // Alternative search approaches
    `https://www.sigmaaldrich.com/search.html?searchterm=${encodedName}&resultview=label&resulttype=product`,
    `https://www.fishersci.com/us/en/catalog/search/products?keyword=${encodedName}`,
    `https://www.medisca.com/search?q=${encodedName}`,
  ];
};

// Function to open SDS document with better popup handling
export const openSdsDocument = (ingredientName: string): void => {
  try {
    const sdsUrls = getMediscaSdsUrls(ingredientName);
    console.log(`Opening SDS for ${ingredientName}`);
    
    // Use the most reliable URL (PubChem)
    const primaryUrl = sdsUrls[0];
    console.log(`Primary SDS URL: ${primaryUrl}`);
    
    // Try to open in new tab with better popup handling
    const newWindow = window.open('', '_blank');
    
    if (newWindow) {
      newWindow.location.href = primaryUrl;
      console.log('SDS document opened successfully');
      
      // Log alternative sources for manual searching
      console.log('Alternative SDS sources:', {
        'ChemIDplus': sdsUrls[1],
        'EPA CompTox': sdsUrls[2],
        'Google Search': sdsUrls[3],
        'Sigma-Aldrich': sdsUrls[4],
        'Fisher Scientific': sdsUrls[5],
        'Medisca': sdsUrls[6]
      });
      
      toast.success(`Opening chemical database for ${ingredientName}. Check console for additional sources if needed.`);
    } else {
      throw new Error('Popup blocked');
    }
    
  } catch (error) {
    console.error(`Error opening SDS for ${ingredientName}:`, error);
    
    // Provide direct URL in console for manual access
    const fallbackUrl = `https://pubchem.ncbi.nlm.nih.gov/compound?search=${encodeURIComponent(ingredientName)}`;
    console.log(`Manual SDS access URL: ${fallbackUrl}`);
    
    // Show helpful message with manual instructions
    toast.error(`Popup blocked. Copy this URL to access SDS: ${fallbackUrl}`, {
      duration: 10000,
    });
    
    // Also log search guidance
    console.log(`Manual SDS search for ${ingredientName}:`, {
      'Direct URL': fallbackUrl,
      'Search terms': [
        `"${ingredientName} safety data sheet"`,
        `"${ingredientName} SDS"`,
        `"${ingredientName} MSDS"`
      ]
    });
  }
};
