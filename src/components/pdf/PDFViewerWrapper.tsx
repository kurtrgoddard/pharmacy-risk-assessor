
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
        border: '1px solid #e2e8f0',
        borderRadius: '0.375rem',
        // Remove boxShadow as it's not recognized by the Style type
      }}
      className="shadow-sm"
    >
      <RiskAssessmentDocument assessmentData={assessmentData} />
    </PDFViewer>
  );
};

export default PDFViewerWrapper;
