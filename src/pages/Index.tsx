
import React, { useState, useEffect } from 'react';
import { FileUploader, LoadingIndicator, RiskAssessment } from '@/components';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

// This would be replaced with actual PDF generation in production
const mockGeneratePDF = async (file: File): Promise<string> => {
  // Simulate network delay and processing
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock PDF data URL
      // In a real implementation, this would involve API calls to process the document
      const fileURL = URL.createObjectURL(file);
      resolve(fileURL);
    }, 3000);
  });
};

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [assessmentPDF, setAssessmentPDF] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Processing your document...");
  const [processingSteps, setProcessingSteps] = useState<string[]>([
    "Analyzing document content",
    "Extracting compound information",
    "Assessing safety parameters",
    "Generating formal risk assessment",
    "Finalizing document",
  ]);
  const [currentStep, setCurrentStep] = useState(0);

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
  };

  const handleGenerateAssessment = async () => {
    if (!file) {
      toast.error("Please upload a PDF document first");
      return;
    }

    try {
      setIsProcessing(true);
      setCurrentStep(0);
      setLoadingMessage(processingSteps[0]);
      
      // In a real implementation, this would call an API to process the PDF
      const pdfDataUrl = await mockGeneratePDF(file);
      setAssessmentPDF(pdfDataUrl);
      
      toast.success("Risk assessment generated successfully");
    } catch (error) {
      console.error("Error generating assessment:", error);
      toast.error("Failed to generate assessment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartOver = () => {
    setFile(null);
    setAssessmentPDF(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-pharmacy-neutral p-4">
      <div className="w-full max-w-6xl">
        {!assessmentPDF ? (
          <div className="glass-card rounded-2xl p-8 shadow-glass">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-3xl font-semibold text-pharmacy-darkBlue mb-2">
                Pharmacy Compound Risk Assessment Generator
              </h1>
              <p className="text-pharmacy-gray max-w-2xl mx-auto">
                Upload technical PDF documents about pharmaceutical compounds and automatically generate a formal risk assessment PDF that adheres to the New Brunswick College of Pharmacists' template.
              </p>
            </div>

            {isProcessing ? (
              <LoadingIndicator message={loadingMessage} />
            ) : (
              <>
                <FileUploader onFileUploaded={handleFileUploaded} />
                
                <div className="mt-8 flex justify-center">
                  <Button 
                    onClick={handleGenerateAssessment}
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
                      <p className="text-xs text-pharmacy-gray">Upload your technical PDF about pharmaceutical compounds</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-4 text-center">
                      <div className="w-8 h-8 bg-pharmacy-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-pharmacy-blue font-medium">2</span>
                      </div>
                      <h4 className="text-sm font-medium text-pharmacy-darkBlue mb-1">AI Processing</h4>
                      <p className="text-xs text-pharmacy-gray">Our system analyzes the content and extracts key information</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-4 text-center">
                      <div className="w-8 h-8 bg-pharmacy-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-pharmacy-blue font-medium">3</span>
                      </div>
                      <h4 className="text-sm font-medium text-pharmacy-darkBlue mb-1">Get Assessment</h4>
                      <p className="text-xs text-pharmacy-gray">Download a compliant risk assessment PDF ready for submission</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <RiskAssessment 
            pdfData={assessmentPDF} 
            fileName={file ? `${file.name.replace('.pdf', '')}_assessment.pdf` : 'risk-assessment.pdf'}
            onStartOver={handleStartOver}
          />
        )}
        
        <footer className="mt-8 text-center text-xs text-pharmacy-gray/70">
          <p>This application complies with the standards set by the New Brunswick College of Pharmacists</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
