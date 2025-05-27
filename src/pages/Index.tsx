import React, { useState, useEffect } from 'react';
import { FileUploader, LoadingIndicator } from '@/components';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Info, Play } from "lucide-react";
import KeswickDataReview from '@/components/KeswickDataReview';
import KeswickRiskAssessment, { KeswickAssessmentData } from '@/components/KeswickRiskAssessment';
import DemoMode from '@/components/DemoMode';
import { getSdsData, clearSdsCache, isPowderFormIngredient, isCreamOrOintment } from '@/utils/mediscaAPI';

// This would be replaced with actual PDF processing in production
const mockProcessDocument = async (file: File, extractedText?: string): Promise<{
  assessmentData: KeswickAssessmentData;
  pdfData: string;
}> => {
  // Simulate network delay and processing
  return new Promise((resolve) => {
    setTimeout(async () => {
      // Mock data URL
      const fileURL = URL.createObjectURL(file);
      
      // Parse ingredients from the extracted text
      let detectedIngredients = [];
      
      // If we have extracted text, try to detect ingredients
      if (extractedText) {
        console.log("Analyzing extracted text for ingredients...");
        
        // Check for common compounding ingredients in the text with improved detection
        const possibleIngredients = [
          "Ketoprofen", "Estradiol", "Gabapentin", "Ketamine", 
          "Baclofen", "Clonidine", "Diclofenac", "Amitriptyline", 
          "Lidocaine", "Prilocaine", "Omeprazole", "Progesterone", 
          "Testosterone", "Diazepam", "Metronidazole", "Tacrolimus"
        ];
        
        // First, try to extract ingredients using better matching patterns
        const ingredientSection = extractIngredientsSection(extractedText);
        const explicitIngredients = extractExplicitIngredients(extractedText, ingredientSection);
        
        // If we found explicit ingredients, use those. Otherwise fall back to keyword search.
        detectedIngredients = explicitIngredients.length > 0 
          ? explicitIngredients
          : possibleIngredients.filter(ingredient => 
              extractedText.toLowerCase().includes(ingredient.toLowerCase())
            );
        
        // If still no ingredients found, try more aggressive text pattern matching
        if (detectedIngredients.length === 0) {
          const potentialIngredients = extractPotentialIngredientsFromText(extractedText);
          if (potentialIngredients.length > 0) {
            detectedIngredients = potentialIngredients;
          }
        }
        
        // Map ingredient names to full objects with SDS data
        detectedIngredients = await Promise.all(detectedIngredients.map(async (name) => {
          // Fetch SDS data for this ingredient
          const sdsData = await getSdsData(typeof name === 'string' ? name : name.name);
          const ingredientName = typeof name === 'string' ? name : name.name;
          
          // Determine if the ingredient has WHMIS hazards based on SDS
          const hasWhmisHazards = sdsData ? 
            sdsData.hazardClassification.whmis.some(h => !h.toLowerCase().includes("not classified")) : 
            false;
          
          // Determine if the ingredient has reproductive toxicity based on SDS
          const hasReproToxicity = sdsData ? 
            sdsData.hazardClassification.ghs.some(h => h.toLowerCase().includes("reproductive")) : 
            false;
          
          // Extract SDS description from exposure risks
          const sdsDescription = sdsData ? 
            sdsData.exposureRisks.join("; ") : 
            "";
          
          // Create ingredient object with values based on SDS
          return {
            name: ingredientName,
            manufacturer: "", // Default to empty string
            nioshStatus: {
              isOnNioshList: false,
              hazardLevel: "Non-Hazardous",
              hazardType: []
            },
            reproductiveToxicity: hasReproToxicity,
            whmisHazards: hasWhmisHazards,
            sdsDescription: sdsDescription,
            monographWarnings: ""
          };
        }));
        
        // If no ingredients were detected, add a placeholder that's clearly identifiable
        if (detectedIngredients.length === 0) {
          const fileName = file.name.replace('.pdf', '').replace(/_/g, ' ');
          detectedIngredients = [{
            name: `Unidentified ingredient in ${fileName}`,
            manufacturer: "", // Empty by default
            nioshStatus: {
              isOnNioshList: false,
              hazardLevel: "Non-Hazardous",
              hazardType: []
            },
            reproductiveToxicity: false,
            whmisHazards: false,
            sdsDescription: "",
            monographWarnings: ""
          }];
        }
      } else {
        // Fallback if no text was extracted
        detectedIngredients = [{
          name: "Extraction failed - please enter ingredients manually",
          manufacturer: "",
          nioshStatus: {
            isOnNioshList: false,
            hazardLevel: "Non-Hazardous",
            hazardType: []
          },
          reproductiveToxicity: false,
          whmisHazards: false,
          sdsDescription: "",
          monographWarnings: ""
        }];
      }
      
      // Determine physical characteristics from both text and SDS data
      let physicalCharacteristics = [];
      
      // Check ingredients for powder form based on SDS data
      const hasPowderIngredient = await checkForPowderIngredients(detectedIngredients);
      
      // Check ingredients for cream/ointment form based on SDS data
      const hasCreamOrOintment = await checkForCreamOrOintmentBase(detectedIngredients);
      
      // Check text content for physical form keywords
      if (extractedText) {
        if (extractedText.toLowerCase().includes("cream") || 
            extractedText.toLowerCase().includes("ointment") || 
            extractedText.toLowerCase().includes("lotion") || 
            extractedText.toLowerCase().includes("gel") ||
            hasCreamOrOintment) {
          physicalCharacteristics.push("Cream/Ointment");
        } 
        
        if (extractedText.toLowerCase().includes("suspension") || 
            extractedText.toLowerCase().includes("solution") || 
            extractedText.toLowerCase().includes("liquid")) {
          physicalCharacteristics.push("Liquid");
        } 
        
        if (extractedText.toLowerCase().includes("powder") || 
            extractedText.toLowerCase().includes("granul") || 
            extractedText.toLowerCase().includes("crystal") ||
            hasPowderIngredient) {
          physicalCharacteristics.push("Powder");
        }
        
        if (extractedText.toLowerCase().includes("tablet") || 
            extractedText.toLowerCase().includes("capsule") || 
            extractedText.toLowerCase().includes("solid")) {
          physicalCharacteristics.push("Solid");
        }
      }
      
      // Set a default if nothing was detected
      if (physicalCharacteristics.length === 0) {
        physicalCharacteristics = ["Semi-Solid"];
      }
      
      // Create fresh assessment data based on the detected ingredients
      const assessmentData: KeswickAssessmentData = {
        compoundName: file.name.replace('.pdf', '').replace(/_/g, ' '),
        din: "N/A (Compounded product)",
        activeIngredients: detectedIngredients,
        preparationDetails: {
          frequency: "As needed",
          quantity: "100g",
          concentrationRisk: false
        },
        physicalCharacteristics: physicalCharacteristics,
        equipmentRequired: ["Balance"],
        safetyChecks: {
          specialEducation: {
            required: false,
            description: ""
          },
          verificationRequired: true,
          equipmentAvailable: true,
          ventilationRequired: hasPowderIngredient || physicalCharacteristics.includes("Powder")
        },
        workflowConsiderations: {
          uninterruptedWorkflow: {
            status: false,
            measures: ""
          },
          microbialContaminationRisk: false,
          crossContaminationRisk: false
        },
        exposureRisks: ["Skin"],
        ppe: {
          gloves: "Regular",
          gown: "Designated Compounding Jacket",
          mask: "Surgical mask",
          eyeProtection: false,
          otherPPE: []
        },
        safetyEquipment: {
          eyeWashStation: true,
          safetyShower: false,
          powderContainmentHood: hasPowderIngredient || physicalCharacteristics.includes("Powder"),
          localExhaustVentilation: hasPowderIngredient || physicalCharacteristics.includes("Powder")
        },
        riskLevel: determineRiskLevel(detectedIngredients, physicalCharacteristics),
        rationale: generateRiskRationale(detectedIngredients, physicalCharacteristics)
      };
      
      // Add inhalation risk for powder ingredients
      if ((hasPowderIngredient || physicalCharacteristics.includes("Powder")) && 
          !assessmentData.exposureRisks.includes("Inhalation")) {
        assessmentData.exposureRisks.push("Inhalation");
      }
      
      // Check for narcotics and update exposure risks and PPE
      const hasNarcoticIngredient = checkForNarcoticIngredients(detectedIngredients);
      if (hasNarcoticIngredient) {
        // Add inhalation risk for narcotics if not already present
        if (!assessmentData.exposureRisks.includes("Inhalation")) {
          assessmentData.exposureRisks.push("Inhalation");
        }
        
        // Update PPE for narcotics
        assessmentData.ppe.mask = "N95 Respirator";
      }
      
      resolve({
        assessmentData,
        pdfData: fileURL
      });
    }, 2000);
  });
};

// Helper function to extract ingredients section from text
const extractIngredientsSection = (text: string): string => {
  // Look for different section headers that might indicate ingredients
  const patterns = [
    /ingredients?[:\s]+([\s\S]+?)(?:directions|preparation|method|storage|section|\d+\.)/i,
    /active ingredients?[:\s]+([\s\S]+?)(?:inactive|excipients|directions|\d+\.)/i,
    /composition[:\s]+([\s\S]+?)(?:directions|preparation|method|\d+\.)/i,
    /formula[:\s]+([\s\S]+?)(?:directions|preparation|method|\d+\.)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      console.log(`Found ingredients section using pattern: ${pattern}`);
      return match[1].trim();
    }
  }
  
  return "";
};

// Helper function to extract explicit ingredients from text
const extractExplicitIngredients = (fullText: string, ingredientSection: string): any[] => {
  const textToSearch = ingredientSection || fullText;
  const ingredients = [];
  
  // Look for patterns like "X% DrugName" or "DrugName X mg"
  const percentagePattern = /(\d+(?:\.\d+)?\s*%\s*)([\w\s-]+?)(?:\s+|$|\n)/g;
  const dosagePattern = /([\w\s-]+?)(?:\s+)(\d+(?:\.\d+)?\s*(?:mg|g|mcg|ml))/g;
  
  let match;
  while ((match = percentagePattern.exec(textToSearch)) !== null) {
    const name = match[2].trim();
    if (name.length > 2) { // Avoid tiny matches that might be errors
      ingredients.push({ name, percentage: match[1] });
    }
  }
  
  // Reset regex state
  dosagePattern.lastIndex = 0;
  
  while ((match = dosagePattern.exec(textToSearch)) !== null) {
    const name = match[1].trim();
    if (name.length > 2 && !ingredients.some(i => i.name === name)) {
      ingredients.push({ name, dosage: match[2] });
    }
  }
  
  // If we found structured ingredients, return them
  if (ingredients.length > 0) {
    console.log("Extracted explicit ingredients:", ingredients);
    return ingredients;
  }
  
  // Otherwise try a simpler approach - look for lines that might be ingredients
  const lines = textToSearch.split(/[\n\r]+/);
  for (const line of lines) {
    const trimmedLine = line.trim();
    // Look for lines that might list an ingredient (containing chemical names)
    if (/^[A-Z][a-z]+(?:\s+[A-Za-z]+){0,3}$/.test(trimmedLine) && trimmedLine.length > 3) {
      ingredients.push({ name: trimmedLine });
    }
  }
  
  return ingredients;
};

// Helper function to extract potential ingredients from unstructured text
const extractPotentialIngredientsFromText = (text: string): string[] => {
  // List of common ingredients to look for in the text
  const commonIngredients = [
    "Omeprazole", "Ketoprofen", "Gabapentin", "Baclofen", "Ketamine", 
    "Lidocaine", "Estradiol", "Clonidine", "Diclofenac", "Amitriptyline",
    "Prilocaine", "Progesterone", "Testosterone", "Diazepam", "Metronidazole"
  ];
  
  return commonIngredients.filter(ingredient => 
    text.toLowerCase().includes(ingredient.toLowerCase())
  );
};

// Helper to check if any ingredients are powder form based on SDS data
const checkForPowderIngredients = async (ingredients: any[]): Promise<boolean> => {
  for (const ingredient of ingredients) {
    const name = typeof ingredient === 'string' ? ingredient : ingredient.name;
    const sdsData = await getSdsData(name);
    if (isPowderFormIngredient(sdsData)) {
      return true;
    }
  }
  return false;
};

// Helper to check if any ingredients are cream/ointment based on SDS data
const checkForCreamOrOintmentBase = async (ingredients: any[]): Promise<boolean> => {
  for (const ingredient of ingredients) {
    const name = typeof ingredient === 'string' ? ingredient : ingredient.name;
    const sdsData = await getSdsData(name);
    if (isCreamOrOintment(sdsData)) {
      return true;
    }
  }
  return false;
};

// Helper to check for narcotic ingredients
const checkForNarcoticIngredients = (ingredients: any[]): boolean => {
  const narcoticKeywords = [
    "ketamine", "codeine", "morphine", "fentanyl", 
    "hydrocodone", "oxycodone", "hydromorphone", "methadone",
    "buprenorphine", "tramadol", "opioid", "diazepam",
    "lorazepam", "alprazolam", "clonazepam", "midazolam"
  ];
  
  // Explicit exclusion for baclofen
  for (const ingredient of ingredients) {
    const name = typeof ingredient === 'string' ? ingredient : ingredient.name;
    if (name.toLowerCase() === "baclofen") continue; // Skip baclofen - not a narcotic
    
    if (narcoticKeywords.some(keyword => name.toLowerCase().includes(keyword))) {
      return true;
    }
  }
  
  return false;
};

// Determine risk level based on NAPRA guidelines
const determineRiskLevel = (ingredients: any[], physicalCharacteristics: string[]): string => {
  // Check for conditions that would require Level C
  const hasHazardousIngredient = ingredients.some(ing => 
    ing.nioshStatus?.isOnNioshList || 
    ing.nioshStatus?.hazardLevel === "Hazardous" ||
    ing.reproductiveToxicity
  );
  
  if (hasHazardousIngredient) {
    return "Level C";
  }
  
  // Check for conditions that would require Level B
  const hasPowderForm = physicalCharacteristics.includes("Powder");
  const hasNarcotic = checkForNarcoticIngredients(ingredients);
  const hasMultipleIngredients = ingredients.length > 1;
  const hasWhmisHazards = ingredients.some(ing => ing.whmisHazards);
  
  if (hasPowderForm || hasNarcotic || (hasMultipleIngredients && hasWhmisHazards)) {
    return "Level B";
  }
  
  // If none of the above conditions are met, default to Level A
  return "Level A";
};

// Generate risk rationale based on ingredients and characteristics
const generateRiskRationale = (ingredients: any[], physicalCharacteristics: string[]): string => {
  // Start with an empty rationale
  let rationale = "";
  
  // Check for conditions that would require Level C
  const hasHazardousIngredient = ingredients.some(ing => 
    ing.nioshStatus?.isOnNioshList || 
    ing.nioshStatus?.hazardLevel === "Hazardous" ||
    ing.reproductiveToxicity
  );
  
  if (hasHazardousIngredient) {
    rationale = "This compound contains ingredients that are classified as hazardous according to NIOSH or have reproductive toxicity concerns. According to NAPRA guidelines, hazardous drugs require Level C containment strategies for safe compounding.";
    return rationale;
  }
  
  // Check for conditions that would require Level B
  const hasPowderForm = physicalCharacteristics.includes("Powder");
  const hasNarcotic = checkForNarcoticIngredients(ingredients);
  const hasMultipleIngredients = ingredients.length > 1;
  const hasWhmisHazards = ingredients.some(ing => ing.whmisHazards);
  
  if (hasPowderForm) {
    rationale = "This compound involves powder formulation which requires Level B risk precautions according to NAPRA guidelines. Powder handling creates inhalation risks and requires appropriate ventilation systems and containment strategies.";
    return rationale;
  }
  
  if (hasNarcotic) {
    rationale = "This compound contains controlled substances (narcotics/opioids) which require Level B risk precautions according to NAPRA guidelines due to their potency and potential for adverse health effects.";
    return rationale;
  }
  
  if (hasMultipleIngredients && hasWhmisHazards) {
    rationale = "This multi-ingredient compound contains components with WHMIS hazard classifications. According to NAPRA guidelines, this combination of factors requires Level B precautions for safe compounding.";
    return rationale;
  }
  
  // Default to Level A
  rationale = "This compound consists of simple preparations with minimal risk factors. According to NAPRA guidelines, Level A precautions with standard operating procedures are sufficient for safe compounding.";
  return rationale;
};

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [assessmentGenerated, setAssessmentGenerated] = useState(false);
  const [assessmentPDF, setAssessmentPDF] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<KeswickAssessmentData | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Processing your document...");
  const [processingSteps, setProcessingSteps] = useState<string[]>([
    "Analyzing document content",
    "Extracting compound information",
    "Querying Medisca SDS database",
    "Identifying NIOSH hazards",
    "Assessing safety parameters",
    "Generating risk assessment",
    "Finalizing documents",
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDataValidated, setIsDataValidated] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Simulates different loading messages during processing
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = prev + 1;
          if (nextStep < processingSteps.length) {
            setLoadingMessage(processingSteps[nextStep]);
            return nextStep;
          }
          clearInterval(interval);
          return prev;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isProcessing, processingSteps]);

  const handleFileUploaded = (uploadedFile: File, extractedText?: string) => {
    // Completely reset all state before processing the new file
    setFile(uploadedFile);
    setAssessmentPDF(null);
    setAssessmentGenerated(false);
    setExtractedData(null);
    setIsDataValidated(false);
    setCurrentStep(0);
    
    // Clear SDS cache for the new upload
    clearSdsCache();
    
    // Log extracted text for debugging
    if (extractedText) {
      console.log("Extracted text from PDF:", extractedText);
      // Here you could implement logic to parse the extractedText
      // and pre-populate the form data based on the PDF content
    }
    
    toast.success("File uploaded successfully, processing content...");
  };

  const handleGenerateDocuments = async () => {
    if (!file) {
      toast.error("Please upload a PDF document first");
      return;
    }

    try {
      setIsProcessing(true);
      setCurrentStep(0);
      setLoadingMessage(processingSteps[0]);
      
      // Get text that was extracted from the PDF during upload
      // Use optional chaining to safely access the property
      const extractedText = file.extractedText || "";
      
      // In a real implementation, this would call an API to process the PDF
      // Pass the extracted text to ensure we're working with current data
      const { assessmentData, pdfData } = await mockProcessDocument(file, extractedText);
      
      setAssessmentPDF(pdfData);
      setExtractedData(assessmentData);
      
      toast.success("Document processed successfully");
    } catch (error) {
      console.error("Error processing document:", error);
      toast.error("Failed to process document. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartOver = () => {
    setFile(null);
    setAssessmentPDF(null);
    setAssessmentGenerated(false);
    setExtractedData(null);
    setIsProcessing(false);
    setIsDataValidated(false);
    clearSdsCache();
  };
  
  const handleDataValidated = () => {
    setIsDataValidated(true);
  };
  
  const handleDataUpdated = (updatedData: KeswickAssessmentData) => {
    setExtractedData(updatedData);
  };
  
  const handleFinalizeAssessment = () => {
    if (!isDataValidated) {
      toast.error("Please validate the data before generating the final assessment");
      return;
    }
    
    setAssessmentGenerated(true);
    toast.success("Final risk assessment generated successfully");
  };

  const handleEnterDemoMode = () => {
    setIsDemoMode(true);
    toast.success("Entering demo mode - explore pre-filled examples");
  };

  const handleExitDemoMode = () => {
    setIsDemoMode(false);
    // Reset all state when exiting demo
    setFile(null);
    setAssessmentPDF(null);
    setAssessmentGenerated(false);
    setExtractedData(null);
    setIsDataValidated(false);
    clearSdsCache();
  };

  if (isDemoMode) {
    return <DemoMode onExitDemo={handleExitDemoMode} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-pharmacy-neutral p-4">
      <div className="w-full max-w-6xl">
        {!extractedData ? (
          <div className="glass-card rounded-2xl p-8 shadow-glass">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-3xl font-semibold text-pharmacy-darkBlue mb-2">
                Compound Formula Document Generator
              </h1>
              <p className="text-pharmacy-gray max-w-2xl mx-auto">
                Upload technical PDF documents about pharmaceutical compounds and automatically generate NAPRA-compliant risk assessments with integrated Medisca SDS data.
              </p>
            </div>

            {isProcessing ? (
              <LoadingIndicator message={loadingMessage} />
            ) : (
              <>
                <FileUploader onFileUploaded={handleFileUploaded} />
                
                <div className="mt-8 flex flex-col items-center gap-4">
                  <Button 
                    onClick={handleGenerateDocuments}
                    disabled={!file}
                    className="bg-pharmacy-blue hover:bg-pharmacy-darkBlue transition-colors duration-200 px-8"
                  >
                    Generate Risk Assessment
                  </Button>
                  
                  <div className="flex items-center gap-2 text-pharmacy-gray text-sm">
                    <span>or</span>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={handleEnterDemoMode}
                    className="text-pharmacy-blue border-pharmacy-blue hover:bg-pharmacy-blue hover:text-white transition-colors duration-200 px-6"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Try Demo
                  </Button>
                </div>
                
                <div className="mt-8 pt-6 border-t border-pharmacy-lightBlue/30">
                  <h3 className="text-center text-sm font-medium text-pharmacy-darkBlue mb-4">How It Works</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/50 rounded-lg p-4 text-center">
                      <div className="w-8 h-8 bg-pharmacy-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-pharmacy-blue font-medium">1</span>
                      </div>
                      <h4 className="text-sm font-medium text-pharmacy-darkBlue mb-1">Upload Document</h4>
                      <p className="text-xs text-pharmacy-gray">Upload your compound formula PDF from PCCA or Medisca</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-4 text-center">
                      <div className="w-8 h-8 bg-pharmacy-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-pharmacy-blue font-medium">2</span>
                      </div>
                      <h4 className="text-sm font-medium text-pharmacy-darkBlue mb-1">AI Processing</h4>
                      <p className="text-xs text-pharmacy-gray">Our system analyzes the content, retrieves SDS data, and identifies hazards</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-4 text-center">
                      <div className="w-8 h-8 bg-pharmacy-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-pharmacy-blue font-medium">3</span>
                      </div>
                      <h4 className="text-sm font-medium text-pharmacy-darkBlue mb-1">Get Risk Assessment</h4>
                      <p className="text-xs text-pharmacy-gray">Download your NAPRA-compliant risk assessment document</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : !assessmentGenerated ? (
          <div className="w-full animate-fade-in">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold text-pharmacy-darkBlue mb-2">
                Review Extracted Information
              </h2>
              <p className="text-pharmacy-gray">
                Please review and validate the information extracted from your PDF and Medisca SDS database
              </p>
            </div>

            <KeswickDataReview 
              extractedData={extractedData}
              onDataValidated={handleDataValidated}
              onDataUpdated={handleDataUpdated}
            />
            
            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={handleStartOver}
                className="flex items-center text-pharmacy-darkBlue"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Upload Different PDF
              </Button>
              
              <Button
                disabled={!isDataValidated}
                onClick={handleFinalizeAssessment}
                className={`bg-pharmacy-blue hover:bg-pharmacy-darkBlue transition-colors duration-200 px-8 ${!isDataValidated ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Generate Final Risk Assessment
              </Button>
            </div>
          </div>
        ) : (
          <KeswickRiskAssessment
            assessmentData={extractedData}
            fileName={file ? `${file.name.replace('.pdf', '')}_risk_assessment.pdf` : 'risk-assessment.pdf'}
            onStartOver={handleStartOver}
          />
        )}
        
        <footer className="mt-8 text-center text-xs text-pharmacy-gray/70">
          <p>This application complies with the standards set by the New Brunswick College of Pharmacists, NAPRA, and USP &lt;795&gt;/&lt;800&gt;</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
