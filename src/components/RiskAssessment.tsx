
import React from "react";
import { PDFViewer } from "@/components";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RiskAssessmentProps {
  pdfData: string;
  fileName: string;
  onStartOver: () => void;
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({
  pdfData,
  fileName,
  onStartOver,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 assessment-appear">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-pharmacy-darkBlue mb-2">
          Assessment Generated
        </h2>
        <p className="text-pharmacy-gray">
          Your compound risk assessment has been successfully generated
        </p>
      </div>

      <PDFViewer pdfData={pdfData} fileName={fileName} />

      <div className="mt-8 flex justify-center">
        <Button
          variant="outline"
          onClick={onStartOver}
          className="flex items-center text-pharmacy-darkBlue hover:text-pharmacy-blue transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Start Over
        </Button>
      </div>
    </div>
  );
};

export default RiskAssessment;
