import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert, ShieldCheck, Info, Download, Eye, Printer } from "lucide-react";
import PDFViewerWrapper, { PDFDataProvider } from "./pdf/PDFViewerWrapper";
import { PDFViewer } from "@/components";
import { Badge } from "@/components/ui/badge";
import { SDSData } from "@/utils/mediscaAPI";
import EnhancedExportButton from './exports/EnhancedExportButton';
import PrintFriendlyView from './exports/PrintFriendlyView';
import { ExportService } from '@/services/exportService';

export interface ActiveIngredient {
  name: string;
  manufacturer: string;
  nioshStatus: {
    isOnNioshList: boolean;
    table?: string;
    hazardLevel: "High Hazard" | "Moderate Hazard" | "Non-Hazardous"; // Required field
    hazardType: string[]; // Required field
  };
  reproductiveToxicity: boolean;
  whmisHazards: boolean;
  sdsDescription: string;
  monographWarnings: string;
  sdsData?: SDSData | null;
}

export interface KeswickAssessmentData {
  compoundName: string;
  din: string;
  activeIngredients: ActiveIngredient[];
  preparationDetails: {
    frequency: string;
    quantity: string;
    concentrationRisk: boolean;
  };
  physicalCharacteristics: string[];
  equipmentRequired: string[];
  safetyChecks: {
    specialEducation: {
      required: boolean;
      description?: string;
    };
    verificationRequired: boolean;
    equipmentAvailable: boolean;
    ventilationRequired: boolean;
  };
  workflowConsiderations: {
    uninterruptedWorkflow: {
      status: boolean;
      measures?: string;
    };
    microbialContaminationRisk: boolean;
    crossContaminationRisk: boolean;
  };
  exposureRisks: string[];
  ppe: {
    gloves: string;
    gown: string;
    mask: string;
    eyeProtection: boolean;
    otherPPE: string[];
  };
  safetyEquipment: {
    eyeWashStation: boolean;
    safetyShower: boolean;
    powderContainmentHood?: boolean;
    localExhaustVentilation?: boolean;
  };
  riskLevel: string;
  rationale: string;
}

interface KeswickRiskAssessmentProps {
  assessmentData: KeswickAssessmentData;
  fileName: string;
  onStartOver: () => void;
}

const KeswickRiskAssessment: React.FC<KeswickRiskAssessmentProps> = ({
  assessmentData,
  fileName,
  onStartOver,
}) => {
  const [showPrintView, setShowPrintView] = useState(false);

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "Level A":
        return <ShieldCheck className="w-6 h-6 text-green-500" />;
      case "Level B":
        return <ShieldAlert className="w-6 h-6 text-yellow-500" />;
      case "Level C":
        return <ShieldAlert className="w-6 h-6 text-red-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Level A":
        return "bg-green-100 text-green-800 border-green-200";
      case "Level B":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Level C":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  if (showPrintView) {
    const shareUrl = ExportService.createShareableLink(assessmentData, 24);
    const qrCodeUrl = ExportService.generateQRCodeData(shareUrl);
    
    return (
      <div>
        <div className="no-print mb-4 text-center">
          <Button onClick={() => setShowPrintView(false)} variant="outline">
            Back to Assessment View
          </Button>
        </div>
        <PrintFriendlyView 
          assessment={assessmentData} 
          qrCodeUrl={qrCodeUrl}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 assessment-appear">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-pharmacy-darkBlue mb-2">
          NAPRA Risk Assessment Document
        </h2>
        <p className="text-pharmacy-gray">
          Here is your generated risk assessment document according to NAPRA guidelines.
        </p>
        <div className="flex justify-center mt-4">
          <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getRiskLevelColor(assessmentData.riskLevel)}`}>
            {getRiskLevelIcon(assessmentData.riskLevel)}
            <span className="ml-2 font-medium">{assessmentData.riskLevel}</span>
          </div>
        </div>
      </div>
      
      <div className="glass-card rounded-xl overflow-hidden p-6 mb-8">
        <div className="mb-6 flex justify-between items-start">
          <h3 className="text-xl font-semibold text-pharmacy-darkBlue">Risk Assessment Summary</h3>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowPrintView(true)}
              variant="outline"
              size="sm"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print View
            </Button>
            <PDFDataProvider assessmentData={assessmentData}>
              {(pdfData) => (
                <EnhancedExportButton 
                  assessment={assessmentData}
                  pdfUrl={pdfData}
                  fileName={fileName}
                />
              )}
            </PDFDataProvider>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-pharmacy-darkBlue mb-4">Risk Assessment Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-md font-medium text-pharmacy-darkBlue mb-2">Compound Information</h4>
              <p className="text-sm text-pharmacy-gray mb-1"><span className="font-medium">Name:</span> {assessmentData.compoundName}</p>
              <p className="text-sm text-pharmacy-gray mb-1"><span className="font-medium">DIN:</span> {assessmentData.din || 'N/A'}</p>
              <p className="text-sm text-pharmacy-gray mb-1">
                <span className="font-medium">Active Ingredients:</span> {assessmentData.activeIngredients.map(ing => {
                  if (ing.manufacturer) {
                    return `${ing.name} (${ing.manufacturer})`;
                  } 
                  return ing.name;
                }).join(', ')}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-md font-medium text-pharmacy-darkBlue mb-2">Risk Level: {assessmentData.riskLevel}</h4>
              <div className="flex items-start mb-2">
                {getRiskLevelIcon(assessmentData.riskLevel)}
                <p className="text-sm text-pharmacy-gray ml-2">{assessmentData.rationale}</p>
              </div>
              <Badge className={getRiskLevelColor(assessmentData.riskLevel)}>
                NAPRA Compliant Assessment
              </Badge>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
            <h4 className="text-md font-medium text-pharmacy-darkBlue mb-2">Required Safety Measures</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-pharmacy-darkBlue">Personal Protective Equipment:</p>
                <ul className="list-disc list-inside text-sm text-pharmacy-gray">
                  <li>Gloves: {assessmentData.ppe.gloves}</li>
                  <li>Gown: {assessmentData.ppe.gown}</li>
                  <li>Mask: {assessmentData.ppe.mask}</li>
                  {assessmentData.ppe.eyeProtection && <li>Eye Protection</li>}
                  {assessmentData.ppe.otherPPE.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-pharmacy-darkBlue">Facility Requirements:</p>
                <ul className="list-disc list-inside text-sm text-pharmacy-gray">
                  <li>Ventilation Required: {assessmentData.safetyChecks.ventilationRequired ? 'Yes' : 'No'}</li>
                  <li>Eye Wash Station: {assessmentData.safetyEquipment.eyeWashStation ? 'Required' : 'Not Required'}</li>
                  <li>Safety Shower: {assessmentData.safetyEquipment.safetyShower ? 'Required' : 'Not Required'}</li>
                  {assessmentData.safetyEquipment.powderContainmentHood && <li>Powder Containment Hood: Required</li>}
                  {assessmentData.safetyEquipment.localExhaustVentilation && <li>Local Exhaust Ventilation: Required</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium text-pharmacy-darkBlue mb-3">NAPRA Compliant Document</h3>
          <p className="text-sm text-pharmacy-gray mb-4">
            The document below follows the NAPRA standard template for compounding risk assessments.
            Use the export options above to download, share, or print this document.
          </p>
        </div>
        
        <PDFDataProvider assessmentData={assessmentData}>
          {(pdfData) => (
            <PDFViewer pdfData={pdfData} fileName={fileName} />
          )}
        </PDFDataProvider>
      </div>

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

export default KeswickRiskAssessment;
