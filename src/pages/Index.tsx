
import React, { useState, useEffect } from 'react';
import { FileUploader, LoadingIndicator } from '@/components';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Info } from "lucide-react";
import KeswickDataReview from '@/components/KeswickDataReview';
import KeswickRiskAssessment, { KeswickAssessmentData } from '@/components/KeswickRiskAssessment';
import { getSdsData, clearSdsCache } from '@/utils/mediscaAPI';

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
        
        // Check for common compounding ingredients in the text
        const possibleIngredients = [
          "Ketoprofen", "Estradiol", "Gabapentin", "Ketamine", 
          "Baclofen", "Clonidine", "Diclofenac", "Amitriptyline", 
          "Lidocaine", "Prilocaine", "Omeprazole"
        ];
        
        detectedIngredients = possibleIngredients.filter(ingredient => 
          extractedText.toLowerCase().includes(ingredient.toLowerCase())
        ).map(async (name) => {
          // Fetch SDS data for this ingredient
          const sdsData = await getSdsData(name);
          
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
            name,
            manufacturer: "", // Default to empty string instead of "Medisca"
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
        });
        
        // Wait for all ingredient SDS data to be fetched
        detectedIngredients = await Promise.all(detectedIngredients);
        
        // If no ingredients were detected, but we have text, try generic extraction
        if (detectedIngredients.length === 0 && extractedText.length > 0) {
          // Look for potential ingredient sections in the text
          const ingredientMatch = extractedText.match(/ingredients?[:|\s]+([\w\s,]+)/i);
          const formulaMatch = extractedText.match(/formula[:|\s]+([\w\s,]+)/i);
          const activeMatch = extractedText.match(/active\s+ingredients?[:|\s]+([\w\s,]+)/i);
          
          // Use the first match we find
          const matchResult = activeMatch || ingredientMatch || formulaMatch;
          
          if (matchResult && matchResult[1]) {
            // Extract potential ingredient names (assume comma or newline separated)
            const potentialIngredients = matchResult[1]
              .split(/[,\n]/)
              .map(i => i.trim())
              .filter(i => i.length > 3); // Filter out very short strings
            
            console.log("Found potential ingredients through text extraction:", potentialIngredients);
            
            // Add these as detected ingredients
            detectedIngredients = potentialIngredients.map(name => ({
              name,
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
            }));
          }
        }
        
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
      
      // Determine physical characteristics from text if available
      let physicalCharacteristics = ["Semi-Solid"];
      if (extractedText) {
        if (extractedText.toLowerCase().includes("cream")) {
          physicalCharacteristics = ["Cream/Ointment"];
        } else if (extractedText.toLowerCase().includes("ointment")) {
          physicalCharacteristics = ["Cream/Ointment"];
        } else if (extractedText.toLowerCase().includes("gel")) {
          physicalCharacteristics = ["Cream/Ointment"];
        } else if (extractedText.toLowerCase().includes("suspension")) {
          physicalCharacteristics = ["Liquid"];
        } else if (extractedText.toLowerCase().includes("powder")) {
          physicalCharacteristics = ["Powder"];
        } else if (extractedText.toLowerCase().includes("tablet")) {
          physicalCharacteristics = ["Solid"];
        } else if (extractedText.toLowerCase().includes("capsule")) {
          physicalCharacteristics = ["Solid"];
        }
      }
      
      // Check if any ingredients are powders (based on name)
      const hasPowderIngredient = detectedIngredients.some(ing => 
        ing.name.toLowerCase().includes("powder") || 
        ing.name.toLowerCase().includes("granul") ||
        ing.name.toLowerCase().includes("crystal")
      );
      
      if (hasPowderIngredient && !physicalCharacteristics.includes("Powder")) {
        physicalCharacteristics.push("Powder");
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
        riskLevel: "Level A", // This will be recalculated correctly by the assessment component
        rationale: "This compound consists of simple preparations with minimal risk factors. According to NAPRA guidelines, Level A precautions with standard operating procedures are sufficient for safe compounding."
      };
      
      // If we detect Ketamine or other narcotics, add inhalation to exposure risks
      const narcoticKeywords = ["ketamine", "codeine", "morphine", "fentanyl", "hydrocodone", "oxycodone", "hydromorphone", "methadone", "buprenorphine", "tramadol"];
      
      const hasNarcoticIngredient = detectedIngredients.some(ing => 
        narcoticKeywords.some(keyword => ing.name.toLowerCase().includes(keyword))
      );
      
      if (hasNarcoticIngredient && !assessmentData.exposureRisks.includes("Inhalation")) {
        assessmentData.exposureRisks.push("Inhalation");
      }
      
      // If we have powders, add inhalation risk
      if ((hasPowderIngredient || physicalCharacteristics.includes("Powder")) && 
          !assessmentData.exposureRisks.includes("Inhalation")) {
        assessmentData.exposureRisks.push("Inhalation");
      }
      
      resolve({
        assessmentData,
        pdfData: fileURL
      });
    }, 2000);
  });
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
                
                <div className="mt-8 flex justify-center">
                  <Button 
                    onClick={handleGenerateDocuments}
                    disabled={!file}
                    className="bg-pharmacy-blue hover:bg-pharmacy-darkBlue transition-colors duration-200 px-8"
                  >
                    Generate Risk Assessment
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
