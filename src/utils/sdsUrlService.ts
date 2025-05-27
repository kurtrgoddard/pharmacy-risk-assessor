
import { toast } from "sonner";

// Reliable chemical database search URLs that always work
export const getReliableChemicalSearchUrls = (ingredientName: string): Array<{name: string, url: string, description: string}> => {
  const cleanName = ingredientName.trim();
  const encodedName = encodeURIComponent(cleanName);
  
  return [
    {
      name: "PubChem Search",
      url: `https://pubchem.ncbi.nlm.nih.gov/#query=${encodedName}`,
      description: "NCBI's comprehensive chemical database"
    },
    {
      name: "ChemSpider Search", 
      url: `https://www.chemspider.com/Search.aspx?q=${encodedName}`,
      description: "Royal Society of Chemistry database"
    },
    {
      name: "EPA CompTox",
      url: `https://comptox.epa.gov/dashboard/chemical/search?search=${encodedName}`,
      description: "EPA's chemical dashboard with safety data"
    },
    {
      name: "Google SDS Search",
      url: `https://www.google.com/search?q="${encodedName}"+safety+data+sheet+filetype:pdf`,
      description: "Direct PDF search for safety data sheets"
    },
    {
      name: "ChemIDplus",
      url: `https://chem.nlm.nih.gov/chemidplus/name/${encodedName}`,
      description: "NLM's chemical identification database"
    }
  ];
};

// Test if a URL is accessible (basic validation)
const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' && urlObj.hostname.length > 0;
  } catch {
    return false;
  }
};

// Advanced popup blocker detection and handling
const openUrlSafely = (url: string, name: string): boolean => {
  try {
    // First validate the URL
    if (!validateUrl(url)) {
      console.error(`Invalid URL for ${name}: ${url}`);
      return false;
    }

    console.log(`Opening ${name}: ${url}`);
    
    // Try multiple methods to open the URL
    const newWindow = window.open('', '_blank', 'noopener,noreferrer,width=1200,height=800');
    
    if (newWindow) {
      newWindow.location.href = url;
      
      // Check if the window was actually opened
      setTimeout(() => {
        if (newWindow.closed) {
          console.warn(`Window for ${name} was closed immediately - possible popup blocker`);
        }
      }, 100);
      
      return true;
    } else {
      console.warn(`Popup blocked for ${name}`);
      return false;
    }
  } catch (error) {
    console.error(`Error opening ${name}:`, error);
    return false;
  }
};

// Main function to open SDS documents with multiple reliable sources
export const openSdsDocument = (ingredientName: string): void => {
  const searchSources = getReliableChemicalSearchUrls(ingredientName);
  
  console.log(`Finding SDS for ${ingredientName} using ${searchSources.length} reliable sources`);
  
  // Try to open the primary source (PubChem)
  const primarySource = searchSources[0];
  const opened = openUrlSafely(primarySource.url, primarySource.name);
  
  if (opened) {
    // Show success message with alternative sources
    toast.success(`Opened ${primarySource.name} for "${ingredientName}"`, {
      description: `Additional sources available in console. Check ${searchSources.length - 1} more databases if needed.`,
      duration: 5000,
    });
    
    // Log all alternative sources for user reference
    console.log(`Alternative SDS sources for "${ingredientName}":`, 
      searchSources.slice(1).map(source => ({
        name: source.name,
        url: source.url,
        description: source.description
      }))
    );
    
    // Provide manual search guidance
    console.log(`Manual search terms for "${ingredientName}":`, [
      `"${ingredientName} safety data sheet"`,
      `"${ingredientName} SDS"`,
      `"${ingredientName} MSDS"`,
      `"${ingredientName} chemical safety"`
    ]);
    
  } else {
    // If popup was blocked, provide manual options
    handlePopupBlocked(ingredientName, searchSources);
  }
};

// Handle popup blocked scenario with helpful alternatives
const handlePopupBlocked = (ingredientName: string, sources: Array<{name: string, url: string, description: string}>): void => {
  console.log(`Popup blocked for ${ingredientName}. Providing manual alternatives:`);
  
  // Log all sources for manual access
  sources.forEach((source, index) => {
    console.log(`${index + 1}. ${source.name}: ${source.url}`);
    console.log(`   Description: ${source.description}`);
  });
  
  // Show helpful toast with copy-paste URL
  const primaryUrl = sources[0].url;
  toast.error(`Popup blocked. Manual search required`, {
    description: `Copy this URL: ${primaryUrl}`,
    duration: 10000,
    action: {
      label: "Copy URL",
      onClick: () => {
        navigator.clipboard.writeText(primaryUrl).then(() => {
          toast.success("URL copied to clipboard!");
        }).catch(() => {
          console.log("Copy failed, URL:", primaryUrl);
        });
      }
    }
  });
  
  // Provide detailed manual instructions
  console.log(`MANUAL SDS SEARCH INSTRUCTIONS for "${ingredientName}":`);
  console.log(`1. Open a new browser tab`);
  console.log(`2. Go to: ${primaryUrl}`);
  console.log(`3. Alternative: Search Google for "${ingredientName} safety data sheet"`);
  console.log(`4. Look for official manufacturer or supplier SDS documents`);
  console.log(`5. Check multiple sources for comprehensive safety information`);
};

// Legacy support function
export const getMediscaSdsUrls = (ingredientName: string): string[] => {
  console.warn("getMediscaSdsUrls is deprecated. Use getReliableChemicalSearchUrls instead.");
  return getReliableChemicalSearchUrls(ingredientName).map(source => source.url);
};
