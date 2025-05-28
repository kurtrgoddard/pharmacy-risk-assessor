
import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { KeswickAssessmentData } from "../KeswickRiskAssessment";

// Import the refactored PDF sections
import HeaderSection from "./document/HeaderSection";
import CompoundSection from "./document/CompoundSection";
import IngredientsSection from "./document/IngredientsSection";
import PreparationSection from "./document/PreparationSection";
import SafetySection from "./document/SafetySection";
import PPESection from "./document/PPESection";
import SignatureSection from "./document/SignatureSection";

// Define document styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: '#ffffff',
  },
  confidentialWatermark: {
    position: 'absolute',
    color: '#E5E7EB',
    opacity: 0.2,
    fontSize: 60,
    transform: 'rotate(-45deg)',
    left: 170,
    top: 400,
  },
  riskLevelA: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  riskLevelB: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  riskLevelC: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
});

// Register font
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 'bold' },
  ]
});

interface RiskAssessmentDocumentProps {
  assessmentData: KeswickAssessmentData;
  pharmacyInfo?: {
    pharmacyName: string;
    licenseNumber: string;
    pharmacistName: string;
    address: string;
  };
}

const RiskAssessmentDocument: React.FC<RiskAssessmentDocumentProps> = ({ assessmentData, pharmacyInfo }) => {
  const currentDate = new Date().toLocaleDateString();
  
  const getRiskLevelStyle = (riskLevel: string) => {
    switch (riskLevel) {
      case "Level A":
        return styles.riskLevelA;
      case "Level B":
        return styles.riskLevelB;
      case "Level C":
        return styles.riskLevelC;
      default:
        return styles.riskLevelA;
    }
  };
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.confidentialWatermark}>CONFIDENTIAL</Text>
        
        {/* Header with Pharmacy information */}
        <HeaderSection 
          pharmacyName={pharmacyInfo?.pharmacyName || "Pharmacy"} 
          address={pharmacyInfo?.address || ""}
          currentDate={currentDate} 
          din={assessmentData.din || ''} 
        />

        {/* Compound Information Section */}
        <CompoundSection 
          assessmentData={assessmentData} 
          riskLevelStyle={getRiskLevelStyle(assessmentData.riskLevel)} 
        />

        {/* Ingredients Section */}
        <IngredientsSection assessmentData={assessmentData} />

        {/* Preparation Details Section */}
        <PreparationSection assessmentData={assessmentData} />

        {/* Safety Requirements Section */}
        <SafetySection assessmentData={assessmentData} />

        {/* PPE and Engineering Controls Section */}
        <PPESection assessmentData={assessmentData} />

        {/* Signature Section */}
        <SignatureSection pharmacyName={pharmacyInfo?.pharmacyName || "Pharmacy"} pharmacistName={pharmacyInfo?.pharmacistName} />
      </Page>
    </Document>
  );
};

export default RiskAssessmentDocument;
