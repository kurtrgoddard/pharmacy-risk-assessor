
import React, { useState, useEffect } from 'react';
import { FileUploader, LoadingIndicator } from '@/components';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Info } from "lucide-react";
import KeswickDataReview from '@/components/KeswickDataReview';
import KeswickRiskAssessment, { KeswickAssessmentData } from '@/components/KeswickRiskAssessment';

// This would be replaced with actual PDF processing in production
const mockProcessDocument = async (file: File): Promise<{
  assessmentData: KeswickAssessmentData;
  pdfData: string;
}> => {
  // Simulate network delay and processing
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data URL
      const fileURL = URL.createObjectURL(file);
      
      // Mock assessment data
      const assessmentData: KeswickAssessmentData = {
        compoundName: "Sample Ketoprofen 10% in PLO Gel",
        din: "N/A (Compounded product)",
        activeIngredients: [
          { 
            name: "Ketoprofen", 
            manufacturer: "PCCA",
            nioshStatus: {
              isOnNioshList: false,
              hazardLevel: "Non-Hazardous",
              hazardType: []
            },
            reproductiveToxicity: false,
            whmisHazards: true,
            sdsDescription: "Causes serious eye irritation. May cause respiratory irritation.",
            monographWarnings: "Contraindicated in patients with hypersensitivity to ketoprofen or other NSAIDs."
          },
          { 
            name: "Estradiol", 
            manufacturer: "Medisca",
            nioshStatus: {
              isOnNioshList: true,
              table: "Table 1",
              hazardLevel: "High Hazard",
              hazardType: ["Reproductive toxicity", "Developmental hazard"]
            },
            reproductiveToxicity: true,
            whmisHazards: true,
            sdsDescription: "May damage fertility or the unborn child. May cause harm to breast-fed children.",
            monographWarnings: "Estrogens with or without progestins should not be used for the prevention of cardiovascular disease or dementia."
          }
        ],
        preparationDetails: {
          frequency: "Weekly",
          quantity: "100g",
          concentrationRisk: false
        },
        physicalCharacteristics: ["Semi-Solid", "Cream/Ointment"],
        equipmentRequired: ["Balance", "Ointment Mill"],
        safetyChecks: {
          specialEducation: {
            required: true,
            description: "Training on handling hormonal compounds required"
          },
          verificationRequired: true,
          equipmentAvailable: true,
          ventilationRequired: true
        },
        workflowConsiderations: {
          uninterruptedWorkflow: {
            status: false,
            measures: "Compound during slow periods, use 'Do Not Disturb' signage"
          },
          microbialContaminationRisk: true,
          crossContaminationRisk: true
        },
        exposureRisks: ["Skin", "Eye"],
        ppe: {
          gloves: "Chemotherapy",
          gown: "Disposable Hazardous Gown",
          mask: "N95",
          eyeProtection: true,
          otherPPE: ["Head covers"]
        },
        safetyEquipment: {
          eyeWashStation: true,
          safetyShower: false
        },
        riskLevel: "Level B",
        rationale: "Contains estradiol which is on NIOSH Table 1 as a hazardous drug with reproductive risks. Requires additional precautions including chemotherapy gloves, gown, and ventilation."
      };
      
      resolve({
        assessmentData,
        pdfData: fileURL
      });
    }, 3000);
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

  const handleFileUploaded = (uploadedFile: File) => {
    setFile(uploadedFile);
    setAssessmentPDF(null);
    setAssessmentGenerated(false);
    setExtractedData(null);
    setIsDataValidated(false);
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
      const { assessmentData, pdfData } = await mockProcessDocument(file);
      
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
                Upload technical PDF documents about pharmaceutical compounds and automatically generate NAPRA-compliant risk assessments.
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
                      <p className="text-xs text-pharmacy-gray">Our system analyzes the content, extracts key information, and identifies hazards</p>
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
                Please review and validate the information extracted from your PDF
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
