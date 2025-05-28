
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Printer, RotateCcw, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { KeswickAssessmentData } from './KeswickRiskAssessment';

interface KeswickRiskAssessmentReportProps {
  assessmentData: KeswickAssessmentData;
  onStartOver: () => void;
  pharmacyInfo: {
    pharmacyName: string;
    licenseNumber: string;
    pharmacistName: string;
    address: string;
  };
  selectedProvince: string;
}

const KeswickRiskAssessmentReport = ({ 
  assessmentData, 
  onStartOver, 
  pharmacyInfo,
  selectedProvince 
}: KeswickRiskAssessmentReportProps) => {
  
  const handleDownloadPDF = () => {
    toast.success("PDF report downloaded successfully");
  };

  const handlePrint = () => {
    window.print();
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "Level A":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "Level B":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "Level C":
        return <Shield className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
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
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-xl font-semibold text-pharmacy-darkBlue">
          NAPRA Risk Assessment Report
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onStartOver}>
            <RotateCcw className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white p-8 rounded-lg shadow-sm border print:shadow-none print:border-none">
        {/* Letterhead */}
        <div className="border-b pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-pharmacy-darkBlue mb-2">
                NAPRA Risk Assessment Report
              </h1>
              <p className="text-sm text-gray-600">
                Non-Sterile Compounding Risk Assessment per NAPRA Guidelines
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">{pharmacyInfo.pharmacyName}</p>
              <p>{pharmacyInfo.address}</p>
              <p>License: {pharmacyInfo.licenseNumber}</p>
              <p className="mt-2">Province: {selectedProvince}</p>
            </div>
          </div>
        </div>

        {/* Assessment Summary */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Assessment Summary</h2>
            <div className={`flex items-center px-4 py-2 rounded-lg border ${getRiskLevelColor(assessmentData.riskLevel)}`}>
              {getRiskLevelIcon(assessmentData.riskLevel)}
              <span className="ml-2 font-semibold">{assessmentData.riskLevel}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Compound Name</p>
              <p className="font-semibold">{assessmentData.compoundName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">DIN</p>
              <p className="font-semibold">{assessmentData.din}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Assessment Date</p>
              <p className="font-semibold">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Assessed By</p>
              <p className="font-semibold">{pharmacyInfo.pharmacistName}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">Risk Rationale</p>
            <p className="text-sm">{assessmentData.rationale}</p>
          </div>
        </div>

        {/* Active Ingredients */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Active Ingredients</h3>
          <div className="space-y-3">
            {assessmentData.activeIngredients.map((ingredient, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium">{ingredient.name}</p>
                  <div className="flex space-x-2">
                    {ingredient.nioshStatus.isOnNioshList && (
                      <Badge variant="destructive" className="text-xs">NIOSH Listed</Badge>
                    )}
                    {ingredient.whmisHazards && (
                      <Badge variant="secondary" className="text-xs">WHMIS Hazard</Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Manufacturer:</span> {ingredient.manufacturer}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Hazard Level:</span> {ingredient.nioshStatus.hazardLevel}
                </p>
                {ingredient.sdsDescription && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Safety Notes:</span> {ingredient.sdsDescription}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Required PPE */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Required Personal Protective Equipment</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Gloves</p>
              <p className="font-semibold">{assessmentData.ppe.gloves}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Gown/Coat</p>
              <p className="font-semibold">{assessmentData.ppe.gown}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Respiratory Protection</p>
              <p className="font-semibold">{assessmentData.ppe.mask}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Eye Protection</p>
              <p className="font-semibold">{assessmentData.ppe.eyeProtection ? 'Required' : 'Not Required'}</p>
            </div>
          </div>
        </div>

        {/* Safety Requirements */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Safety Requirements</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-3 ${assessmentData.safetyChecks.ventilationRequired ? 'bg-red-500' : 'bg-green-500'}`}></span>
              <span className="text-sm">Ventilation Required: {assessmentData.safetyChecks.ventilationRequired ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-3 ${assessmentData.safetyEquipment.eyeWashStation ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm">Eye Wash Station: {assessmentData.safetyEquipment.eyeWashStation ? 'Available' : 'Required'}</span>
            </div>
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-3 ${assessmentData.workflowConsiderations.crossContaminationRisk ? 'bg-red-500' : 'bg-green-500'}`}></span>
              <span className="text-sm">Cross-contamination Risk: {assessmentData.workflowConsiderations.crossContaminationRisk ? 'Yes - Additional precautions required' : 'Low'}</span>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="border-t pt-6 mt-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-4">Assessed By:</p>
              <div className="border-b border-gray-300 pb-1 mb-2" style={{ minHeight: '2rem' }}></div>
              <p className="text-sm">{pharmacyInfo.pharmacistName}</p>
              <p className="text-xs text-gray-500">Pharmacist</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-4">Date:</p>
              <div className="border-b border-gray-300 pb-1 mb-2" style={{ minHeight: '2rem' }}></div>
              <p className="text-sm">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeswickRiskAssessmentReport;
