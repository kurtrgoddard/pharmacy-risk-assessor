import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NAPRARiskAssessment {
  // Basic preparation information
  preparationName: string;
  preparedBy: string;
  reviewedBy: string;
  dateAssessed: string;
  
  // Risk factors
  complexityFactors: {
    requiresCalculations: boolean;
    requiresSpecializedEquipment: boolean;
    requiresSpecializedKnowledge: boolean;
    multipleIngredients: boolean;
    difficultPreparationProcess: boolean;
  };
  
  hazardousFactors: {
    containsNIOSHIngredients: boolean;
    containsWHMISIngredients: boolean;
    reproductiveRisk: boolean;
    respiratoryRisk: boolean;
    contactSensitizer: boolean;
  };
  
  frequencyVolume: {
    frequencyOfPreparation: "daily" | "weekly" | "monthly" | "rarely";
    volumePreparation: "large" | "medium" | "small";
  };
  
  concentrationRisk: boolean;
  
  exposureRisk: {
    routesOfExposure: string[];
    exposureDuration: "prolonged" | "moderate" | "minimal";
  };
  
  crossContaminationRisk: boolean;
  microbialContaminationRisk: boolean;
  
  // Final assessment
  assignedRiskLevel: "A" | "B" | "C" | "";
  riskJustification: string;
  
  // Control measures
  recommendedControls: {
    engineeringControls: string[];
    administrativeControls: string[];
    ppe: string[];
    otherControls: string[];
  };
}

interface NAPRAAssessmentReportProps {
  assessment: NAPRARiskAssessment;
  onBack: () => void;
}

const NAPRAAssessmentReport: React.FC<NAPRAAssessmentReportProps> = ({
  assessment,
  onBack,
}) => {
  const printReport = () => {
    window.print();
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Generate risk level badge
  const getRiskLevelBadge = (level: "A" | "B" | "C" | "") => {
    if (!level) return null;
    
    const colorMap = {
      A: "bg-green-100 text-green-800 hover:bg-green-100",
      B: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      C: "bg-red-100 text-red-800 hover:bg-red-100",
    };
    
    return (
      <Badge className={`text-sm px-3 py-1 ${colorMap[level]}`}>
        Risk Level {level}
      </Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 print:p-0">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Button variant="outline" onClick={onBack} size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={printReport} size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <div className="print:py-8">
        <Card className="shadow-lg print:shadow-none">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-pharmacy-darkBlue">
                  NAPRA Non-Sterile Risk Assessment
                </CardTitle>
                <CardDescription>
                  Completed on {formatDate(assessment.dateAssessed)}
                </CardDescription>
              </div>
              {getRiskLevelBadge(assessment.assignedRiskLevel)}
            </div>
          </CardHeader>
          
          <CardContent className="py-6 space-y-6">
            {/* Basic information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-pharmacy-darkBlue">Preparation</h3>
                <p className="text-pharmacy-gray">{assessment.preparationName}</p>
              </div>
              <div>
                <h3 className="font-medium text-pharmacy-darkBlue">Date</h3>
                <p className="text-pharmacy-gray">{formatDate(assessment.dateAssessed)}</p>
              </div>
              <div>
                <h3 className="font-medium text-pharmacy-darkBlue">Prepared By</h3>
                <p className="text-pharmacy-gray">{assessment.preparedBy || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-medium text-pharmacy-darkBlue">Reviewed By</h3>
                <p className="text-pharmacy-gray">{assessment.reviewedBy || "Not specified"}</p>
              </div>
            </div>
            
            {/* Risk level and justification */}
            <div className={`p-4 rounded ${
              assessment.assignedRiskLevel === "A" ? "bg-green-50" :
              assessment.assignedRiskLevel === "B" ? "bg-yellow-50" :
              "bg-red-50"
            }`}>
              <h3 className={`font-medium ${
                assessment.assignedRiskLevel === "A" ? "text-green-800" :
                assessment.assignedRiskLevel === "B" ? "text-yellow-800" :
                "text-red-800"
              }`}>
                Risk Level {assessment.assignedRiskLevel} Assigned
              </h3>
              <p className="whitespace-pre-line mt-2 text-sm">{assessment.riskJustification}</p>
            </div>
            
            {/* Risk factors */}
            <div>
              <h3 className="font-medium text-pharmacy-darkBlue mb-2">Risk Factors Identified</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Complexity */}
                <div className="border rounded p-3">
                  <h4 className="text-sm font-medium mb-2">Complexity Factors</h4>
                  <ul className="list-disc list-inside text-sm">
                    {assessment.complexityFactors.requiresCalculations && (
                      <li>Requires complex calculations</li>
                    )}
                    {assessment.complexityFactors.requiresSpecializedEquipment && (
                      <li>Requires specialized equipment</li>
                    )}
                    {assessment.complexityFactors.requiresSpecializedKnowledge && (
                      <li>Requires specialized knowledge</li>
                    )}
                    {assessment.complexityFactors.multipleIngredients && (
                      <li>Contains multiple ingredients</li>
                    )}
                    {assessment.complexityFactors.difficultPreparationProcess && (
                      <li>Difficult preparation process</li>
                    )}
                    {!Object.values(assessment.complexityFactors).some(v => v) && (
                      <li className="text-gray-500">No complexity factors identified</li>
                    )}
                  </ul>
                </div>
                
                {/* Hazardous */}
                <div className="border rounded p-3">
                  <h4 className="text-sm font-medium mb-2">Hazardous Characteristics</h4>
                  <ul className="list-disc list-inside text-sm">
                    {assessment.hazardousFactors.containsNIOSHIngredients && (
                      <li className="text-red-600">Contains NIOSH listed ingredients</li>
                    )}
                    {assessment.hazardousFactors.containsWHMISIngredients && (
                      <li>Contains WHMIS health hazards</li>
                    )}
                    {assessment.hazardousFactors.reproductiveRisk && (
                      <li className="text-red-600">Reproductive toxicity risks</li>
                    )}
                    {assessment.hazardousFactors.respiratoryRisk && (
                      <li>Respiratory sensitizers/irritants</li>
                    )}
                    {assessment.hazardousFactors.contactSensitizer && (
                      <li>Skin sensitizers/irritants</li>
                    )}
                    {!Object.values(assessment.hazardousFactors).some(v => v) && (
                      <li className="text-gray-500">No hazardous characteristics identified</li>
                    )}
                  </ul>
                </div>
                
                {/* Frequency/Volume */}
                <div className="border rounded p-3">
                  <h4 className="text-sm font-medium mb-2">Frequency and Volume</h4>
                  <ul className="list-disc list-inside text-sm">
                    <li>
                      Frequency: {assessment.frequencyVolume.frequencyOfPreparation.charAt(0).toUpperCase() + 
                      assessment.frequencyVolume.frequencyOfPreparation.slice(1)}
                    </li>
                    <li>
                      Volume: {assessment.frequencyVolume.volumePreparation.charAt(0).toUpperCase() + 
                      assessment.frequencyVolume.volumePreparation.slice(1)}
                    </li>
                    {assessment.concentrationRisk && (
                      <li>API concentration presents health risks</li>
                    )}
                  </ul>
                </div>
                
                {/* Exposure */}
                <div className="border rounded p-3">
                  <h4 className="text-sm font-medium mb-2">Exposure Risks</h4>
                  <ul className="list-disc list-inside text-sm">
                    {assessment.exposureRisk.routesOfExposure.map((route, index) => (
                      <li key={index}>{route}</li>
                    ))}
                    {assessment.exposureRisk.routesOfExposure.length === 0 && (
                      <li className="text-gray-500">No specific routes identified</li>
                    )}
                    <li>
                      Duration: {assessment.exposureRisk.exposureDuration.charAt(0).toUpperCase() + 
                      assessment.exposureRisk.exposureDuration.slice(1)}
                    </li>
                  </ul>
                </div>
                
                {/* Contamination */}
                <div className="border rounded p-3">
                  <h4 className="text-sm font-medium mb-2">Contamination Risks</h4>
                  <ul className="list-disc list-inside text-sm">
                    {assessment.crossContaminationRisk && (
                      <li>Risk of cross-contamination</li>
                    )}
                    {assessment.microbialContaminationRisk && (
                      <li>Risk of microbial contamination</li>
                    )}
                    {!assessment.crossContaminationRisk && !assessment.microbialContaminationRisk && (
                      <li className="text-gray-500">No contamination risks identified</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Recommended controls */}
            <div>
              <h3 className="font-medium text-pharmacy-darkBlue mb-2">Recommended Control Measures</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Engineering controls */}
                <div className="border rounded p-3">
                  <h4 className="text-sm font-medium mb-2">Engineering Controls</h4>
                  <ul className="list-disc list-inside text-sm">
                    {assessment.recommendedControls.engineeringControls.map((control, index) => (
                      <li key={index}>{control}</li>
                    ))}
                    {assessment.recommendedControls.engineeringControls.length === 0 && (
                      <li className="text-gray-500">No specific engineering controls recommended</li>
                    )}
                  </ul>
                </div>
                
                {/* Administrative controls */}
                <div className="border rounded p-3">
                  <h4 className="text-sm font-medium mb-2">Administrative Controls</h4>
                  <ul className="list-disc list-inside text-sm">
                    {assessment.recommendedControls.administrativeControls.map((control, index) => (
                      <li key={index}>{control}</li>
                    ))}
                    {assessment.recommendedControls.administrativeControls.length === 0 && (
                      <li className="text-gray-500">No specific administrative controls recommended</li>
                    )}
                  </ul>
                </div>
                
                {/* PPE */}
                <div className="border rounded p-3">
                  <h4 className="text-sm font-medium mb-2">Personal Protective Equipment</h4>
                  <ul className="list-disc list-inside text-sm">
                    {assessment.recommendedControls.ppe.map((ppe, index) => (
                      <li key={index}>{ppe}</li>
                    ))}
                    {assessment.recommendedControls.ppe.length === 0 && (
                      <li className="text-gray-500">No specific PPE recommended</li>
                    )}
                  </ul>
                </div>
                
                {/* Other controls */}
                <div className="border rounded p-3">
                  <h4 className="text-sm font-medium mb-2">Other Control Measures</h4>
                  <ul className="list-disc list-inside text-sm">
                    {assessment.recommendedControls.otherControls.map((control, index) => (
                      <li key={index}>{control}</li>
                    ))}
                    {assessment.recommendedControls.otherControls.length === 0 && (
                      <li className="text-gray-500">No other controls specified</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* NAPRA requirements section */}
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium text-pharmacy-darkBlue mb-2">
                NAPRA Requirements for Level {assessment.assignedRiskLevel} Compounds
              </h3>
              
              {assessment.assignedRiskLevel === "A" && (
                <div className="text-sm space-y-2">
                  <p>• May be prepared in a non-segregated compounding area</p>
                  <p>• Regular cleaning procedures are sufficient</p>
                  <p>• Standard operating procedures should be developed and followed</p>
                  <p>• Basic PPE requirements (gloves, lab coat) are sufficient</p>
                  <p>• No special ventilation requirements</p>
                </div>
              )}
              
              {assessment.assignedRiskLevel === "B" && (
                <div className="text-sm space-y-2">
                  <p>• Must be prepared in a separate, well-ventilated compounding space</p>
                  <p>• Enhanced cleaning procedures required</p>
                  <p>• Comprehensive SOPs must be developed and followed</p>
                  <p>• Enhanced PPE requirements based on risk assessment</p>
                  <p>• Personnel must have demonstrated competency</p>
                  <p>• May require external ventilation</p>
                </div>
              )}
              
              {assessment.assignedRiskLevel === "C" && (
                <div className="text-sm space-y-2">
                  <p>• Must be prepared in a dedicated compounding room</p>
                  <p>• Appropriate C-PEC (Containment Primary Engineering Control) required</p>
                  <p>• Room must have external ventilation with appropriate air changes</p>
                  <p>• Comprehensive hazardous drug containment strategy required</p>
                  <p>• Enhanced PPE specific to hazard type required</p>
                  <p>• Comprehensive training and demonstrated competency required</p>
                  <p>• Regular environmental monitoring</p>
                  <p>• Specialized cleaning procedures required</p>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-4 flex justify-between">
            <div className="text-sm text-pharmacy-gray">
              Prepared in accordance with NAPRA Non-Sterile Compounding Guidelines
            </div>
            <div className="text-sm text-pharmacy-gray">
              {formatDate(assessment.dateAssessed)}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default NAPRAAssessmentReport;
