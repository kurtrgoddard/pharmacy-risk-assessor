
import React from "react";
import { PDFViewer } from '@react-pdf/renderer';
import RiskAssessmentDocument from "./RiskAssessmentDocument";
import { KeswickAssessmentData } from "../KeswickRiskAssessment";
import { BlobProvider } from '@react-pdf/renderer';

interface PDFViewerWrapperProps {
  assessmentData: KeswickAssessmentData;
  fileName: string;
}

const PDFViewerWrapper: React.FC<PDFViewerWrapperProps> = ({ assessmentData, fileName }) => {
  // For direct viewing in the application
  return (
    <PDFViewer
      width="100%"
      height={600}
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: '0.375rem',
      }}
      className="shadow-sm"
    >
      <RiskAssessmentDocument assessmentData={assessmentData} />
    </PDFViewer>
  );
};

// Create a wrapper that exports the PDF data as blob URL for downloading
export const PDFDataProvider: React.FC<{
  assessmentData: KeswickAssessmentData;
  children: (pdfData: string) => React.ReactNode;
}> = ({ assessmentData, children }) => {
  return (
    <BlobProvider document={<RiskAssessmentDocument assessmentData={assessmentData} />}>
      {({ blob, url, loading, error }) => {
        if (loading) return <div>Loading document...</div>;
        if (error) return <div>Error generating PDF: {error.message}</div>;
        return children(url || '');
      }}
    </BlobProvider>
  );
};

export default PDFViewerWrapper;
