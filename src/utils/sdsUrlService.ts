
import { toast } from "sonner";

// Updated URL patterns with more reliable external sources first
export const getMediscaSdsUrls = (ingredientName: string): string[] => {
  const cleanName = ingredientName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  const encodedName = encodeURIComponent(ingredientName);
  const encodedCleanName = encodeURIComponent(cleanName);
  
  return [
    // Start with more reliable external databases
    `https://pubchem.ncbi.nlm.nih.gov/compound/${encodedName}`,
    `https://www.ncbi.nlm.nih.gov/pccompound?term=${encodedName}`,
    `https://comptox.epa.gov/dashboard/chemical/search/${encodedName}`,
    `http://www.chemspider.com/Search.aspx?q=${encodedName}`,
    `https://chem.nlm.nih.gov/chemidplus/name/${encodedName}`,
    // Try Medisca with different approaches
    `https://www.medisca.com/safety-data-sheets`,
    `https://www.medisca.com/search?q=${encodedName}`,
    `https://www.medisca.com/Pages/Search?query=${encodedName}`,
    // Generic SDS search engines
    `https://www.google.com/search?q="${encodedName}"+SDS+safety+data+sheet+filetype:pdf`,
    `https://www.fishersci.com/us/en/catalog/search/sdshome.html?search=${encodedName}`,
    `https://www.sigmaaldrich.com/safety-center.html?searchterm=${encodedName}`
  ];
};

// Function to open SDS document with improved fallback strategy
export const openSdsDocument = (ingredientName: string): void => {
  try {
    const sdsUrls = getMediscaSdsUrls(ingredientName);
    console.log(`Opening SDS for ${ingredientName} with ${sdsUrls.length} URL options`);
    
    // Start with PubChem as it's most reliable
    const primaryUrl = sdsUrls[0];
    console.log(`Opening primary SDS URL (PubChem): ${primaryUrl}`);
    
    const newWindow = window.open(primaryUrl, '_blank', 'noopener,noreferrer,width=1200,height=800');
    
    if (!newWindow) {
      throw new Error('Popup blocked or failed to open');
    }
    
    console.log('Alternative SDS sources available:', {
      'Chemical databases': sdsUrls.slice(1, 5),
      'Medisca alternatives': sdsUrls.slice(5, 8),
      'Search engines': sdsUrls.slice(8),
      'Manual search tips': [
        `Search "${ingredientName} SDS" on Google`,
        `Check manufacturer websites directly`,
        `Contact your chemical supplier`,
        `Search chemical databases like NIOSH, EPA, or OSHA`
      ]
    });
    
    toast.success(`Opening chemical database for ${ingredientName}. Check console for additional sources if needed.`);
    
  } catch (error) {
    console.error(`Error opening SDS for ${ingredientName}:`, error);
    
    // Provide helpful manual search guidance
    console.log(`Manual SDS search guidance for ${ingredientName}:`, {
      'Recommended searches': [
        `"${ingredientName} safety data sheet"`,
        `"${ingredientName} SDS"`,
        `"${ingredientName} MSDS"`
      ],
      'Reliable databases': [
        'PubChem (https://pubchem.ncbi.nlm.nih.gov/)',
        'ChemIDplus (https://chem.nlm.nih.gov/chemidplus/)',
        'EPA CompTox (https://comptox.epa.gov/dashboard/)',
        'NIOSH Pocket Guide (https://www.cdc.gov/niosh/npg/)'
      ],
      'Supplier websites': [
        'Sigma-Aldrich',
        'Fisher Scientific',
        'Your specific ingredient supplier'
      ]
    });
    
    toast.error("SDS lookup temporarily unavailable. Check console for manual search options and reliable chemical databases.");
    throw new Error(`Could not open SDS for ${ingredientName}`);
  }
};
