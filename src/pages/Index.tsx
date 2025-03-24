
import React, { useState, useEffect } from 'react';
import { FileUploader, LoadingIndicator, DocumentPreview } from '@/components';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";

// This would be replaced with actual PDF processing in production
const mockProcessDocument = async (file: File): Promise<{
  riskAssessmentData: string;
  masterFormulaData: string;
  extractedData: ExtractedFormulaData;
}> => {
  // Simulate network delay and processing
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data URLs
      // In a real implementation, this would involve API calls to process the document
      const fileURL = URL.createObjectURL(file);
      
      // Mock extracted data
      const extractedData: ExtractedFormulaData = {
        compoundName: "Sample Compound",
        activeIngredients: [
          { name: "Ketoprofen", concentration: "10%", nioshHazard: "Non-hazardous" },
          { name: "Estradiol", concentration: "0.01%", nioshHazard: "Hazardous - Reproductive risk" }
        ],
        inactiveIngredients: [
          { name: "Pluronic Lecithin Organogel (PLO)", amount: "qs 100g" }
        ],
        beyondUseDate: "14 days at room temperature",
        storageInstructions: "Store at room temperature in a tightly closed container. Protect from light.",
        containerType: "Airless pump dispenser",
        compoundingProcedure: [
          "1. Calculate the required quantity of each ingredient.",
          "2. Weigh/measure each ingredient accurately using a calibrated scale.",
          "3. Mix the active ingredients with a small amount of the base.",
          "4. Incorporate the remaining base and mix until uniform."
        ],
        specialInstructions: "Use chemical protective gloves when handling estradiol."
      };
      
      resolve({
        riskAssessmentData: fileURL,
        masterFormulaData: fileURL,
        extractedData
      });
    }, 3000);
  });
};

export interface IngredientData {
  name: string;
  concentration?: string;
  amount?: string;
  nioshHazard?: string;
}

export interface ExtractedFormulaData {
  compoundName: string;
  activeIngredients: IngredientData[];
  inactiveIngredients: IngredientData[];
  beyondUseDate: string;
  storageInstructions: string;
  containerType: string;
  compoundingProcedure: string[];
  specialInstructions: string;
}

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentsGenerated, setDocumentsGenerated] = useState(false);
  const [riskAssessmentPDF, setRiskAssessmentPDF] = useState<string | null>(null);
  const [masterFormulaPDF, setMasterFormulaPDF] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedFormulaData | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Processing your document...");
  const [processingSteps, setProcessingSteps] = useState<string[]>([
    "Analyzing document content",
    "Extracting compound information",
    "Identifying NIOSH hazards",
    "Assessing safety parameters",
    "Generating risk assessment",
    "Creating master formula",
    "Finalizing documents",
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState("risk");

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

  const handleFileUploaded = (uploadedFile: File) => {
    setFile(uploadedFile);
    setRiskAssessmentPDF(null);
    setMasterFormulaPDF(null);
    setDocumentsGenerated(false);
    setExtractedData(null);
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
      
      // In a real implementation, this would call an API to process the PDF
      const { riskAssessmentData, masterFormulaData, extractedData } = await mockProcessDocument(file);
      
      setRiskAssessmentPDF(riskAssessmentData);
      setMasterFormulaPDF(masterFormulaData);
      setExtractedData(extractedData);
      setDocumentsGenerated(true);
      
      toast.success("Documents generated successfully");
    } catch (error) {
      console.error("Error generating documents:", error);
      toast.error("Failed to generate documents. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartOver = () => {
    setFile(null);
    setRiskAssessmentPDF(null);
    setMasterFormulaPDF(null);
    setDocumentsGenerated(false);
    setExtractedData(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-pharmacy-neutral p-4">
      <div className="w-full max-w-6xl">
        {!documentsGenerated ? (
          <div className="glass-card rounded-2xl p-8 shadow-glass">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-3xl font-semibold text-pharmacy-darkBlue mb-2">
                Compound Formula Document Generator
              </h1>
              <p className="text-pharmacy-gray max-w-2xl mx-auto">
                Upload technical PDF documents about pharmaceutical compounds and automatically generate NAPRA-compliant risk assessments and master formulas.
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
                    Generate Documents
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
                      <p className="text-xs text-pharmacy-gray">Our system analyzes the content, extracts key information, and identifies hazards</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-4 text-center">
                      <div className="w-8 h-8 bg-pharmacy-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-pharmacy-blue font-medium">3</span>
                      </div>
                      <h4 className="text-sm font-medium text-pharmacy-darkBlue mb-1">Get Documents</h4>
                      <p className="text-xs text-pharmacy-gray">Download both NAPRA-compliant risk assessment and master formula PDFs</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full animate-fade-in">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold text-pharmacy-darkBlue mb-2">
                Documents Generated
              </h2>
              <p className="text-pharmacy-gray">
                Your compound documents have been successfully generated
              </p>
            </div>

            {extractedData && (
              <div className="mb-8 glass-card p-6 rounded-xl">
                <h3 className="text-lg font-medium text-pharmacy-darkBlue mb-4">Extracted Information</h3>
                <p className="text-sm text-pharmacy-gray mb-2">
                  Please review the extracted information below and verify its accuracy. If needed, you can modify the information before downloading the final documents.
                </p>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-pharmacy-darkBlue mb-2">Compound Details</h4>
                    <div className="text-sm space-y-2">
                      <p><span className="font-medium">Name:</span> {extractedData.compoundName}</p>
                      <p><span className="font-medium">BUD:</span> {extractedData.beyondUseDate}</p>
                      <p><span className="font-medium">Storage:</span> {extractedData.storageInstructions}</p>
                      <p><span className="font-medium">Container:</span> {extractedData.containerType}</p>
                    </div>
                    
                    <h4 className="text-md font-medium text-pharmacy-darkBlue mt-4 mb-2">Active Ingredients</h4>
                    <div className="text-sm space-y-1">
                      {extractedData.activeIngredients.map((ingredient, index) => (
                        <div key={index} className="flex justify-between border-b pb-1">
                          <p>{ingredient.name} ({ingredient.concentration})</p>
                          <p className={ingredient.nioshHazard?.includes("Hazardous") ? "text-red-500" : "text-green-600"}>
                            {ingredient.nioshHazard}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-pharmacy-darkBlue mb-2">Inactive Ingredients</h4>
                    <div className="text-sm space-y-1">
                      {extractedData.inactiveIngredients.map((ingredient, index) => (
                        <div key={index} className="flex justify-between border-b pb-1">
                          <p>{ingredient.name}</p>
                          <p>{ingredient.amount}</p>
                        </div>
                      ))}
                    </div>
                    
                    <h4 className="text-md font-medium text-pharmacy-darkBlue mt-4 mb-2">Compounding Procedure</h4>
                    <div className="text-sm space-y-1">
                      {extractedData.compoundingProcedure.map((step, index) => (
                        <p key={index} className="text-sm">{step}</p>
                      ))}
                    </div>
                    
                    <h4 className="text-md font-medium text-pharmacy-darkBlue mt-4 mb-2">Special Instructions</h4>
                    <p className="text-sm">{extractedData.specialInstructions}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button
                    className="bg-pharmacy-blue hover:bg-pharmacy-darkBlue text-white"
                  >
                    Confirm Information
                  </Button>
                </div>
              </div>
            )}

            <div className="glass-card rounded-xl overflow-hidden">
              <Tabs 
                defaultValue="risk" 
                className="w-full"
                onValueChange={setActiveTab}
              >
                <div className="flex justify-center p-4 bg-pharmacy-neutral border-b">
                  <TabsList className="grid grid-cols-2 w-full max-w-md">
                    <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
                    <TabsTrigger value="formula">Master Formula</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="risk" className="m-0">
                  {riskAssessmentPDF && (
                    <DocumentPreview 
                      pdfData={riskAssessmentPDF} 
                      fileName={file ? `${file.name.replace('.pdf', '')}_risk_assessment.pdf` : 'risk-assessment.pdf'}
                      documentType="Risk Assessment"
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="formula" className="m-0">
                  {masterFormulaPDF && (
                    <DocumentPreview 
                      pdfData={masterFormulaPDF} 
                      fileName={file ? `${file.name.replace('.pdf', '')}_master_formula.pdf` : 'master-formula.pdf'}
                      documentType="Master Formula"
                    />
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                onClick={handleStartOver}
                className="flex items-center text-pharmacy-darkBlue hover:text-pharmacy-blue transition-colors duration-200"
              >
                Upload Another Document
              </Button>
            </div>
          </div>
        )}
        
        <footer className="mt-8 text-center text-xs text-pharmacy-gray/70">
          <p>This application complies with the standards set by the New Brunswick College of Pharmacists, NAPRA, and USP &lt;795&gt;/&lt;800&gt;</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
