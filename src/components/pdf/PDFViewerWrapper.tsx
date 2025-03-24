
import React from "react";
import { PDFViewer } from '@react-pdf/renderer';
import RiskAssessmentDocument from "./RiskAssessmentDocument";
import { KeswickAssessmentData } from "../KeswickRiskAssessment";

interface PDFViewerWrapperProps {
  assessmentData: KeswickAssessmentData;
  fileName: string;
}

const PDFViewerWrapper: React.FC<PDFViewerWrapperProps> = ({ assessmentData, fileName }) => {
  return (
    <PDFViewer
      width="100%"
      height={600}
      style={{ 
        display: "flex", 
        flexDirection: "column" 
      }}
      className="border border-gray-300 rounded-md shadow-sm"
    >
      <RiskAssessmentDocument assessmentData={assessmentData} />
    </PDFViewer>
  );
};

export default PDFViewerWrapper;
