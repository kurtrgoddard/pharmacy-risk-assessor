
import React from "react";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KeswickRiskAssessmentProps {
  assessmentData: KeswickAssessmentData;
  fileName: string;
  onStartOver: () => void;
}

export interface KeswickAssessmentData {
  compoundName: string;
  din: string;
  activeIngredients: {
    name: string;
    manufacturer: string;
    nioshStatus: {
      isOnNioshList: boolean;
      table?: string;
    };
    reproductiveToxicity: boolean;
    whmisHazards: boolean;
    sdsDescription: string;
    monographWarnings: string;
  }[];
  preparationDetails: {
    frequency: "Daily" | "Weekly" | "Monthly" | "Less";
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
    gloves: "Regular" | "Chemotherapy" | "Double Gloves";
    gown: "Designated Compounding Jacket" | "Disposable Hazardous Gown";
    mask: "Surgical mask" | "N95" | "Other";
    eyeProtection: boolean;
    otherPPE: string[];
  };
  safetyEquipment: {
    eyeWashStation: boolean;
    safetyShower: boolean;
  };
  riskLevel: "Level A" | "Level B" | "Level C";
  rationale: string;
}

const KeswickRiskAssessment: React.FC<KeswickRiskAssessmentProps> = ({
  assessmentData,
  fileName,
  onStartOver,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real implementation, we would generate a PDF and download it
    // For now, we'll just show a toast message
    console.log("Downloading Risk Assessment");
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 assessment-appear">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-pharmacy-darkBlue mb-2">
          Risk Assessment Generated
        </h2>
        <p className="text-pharmacy-gray">
          Your compound risk assessment has been successfully generated
        </p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden mb-8">
        <div className="flex items-center justify-between p-4 bg-pharmacy-neutral border-b">
          <div className="flex items-center">
            <h3 className="font-medium text-pharmacy-darkBlue">
              Keswick Compounding Pharmacy – Non-sterile Compounding Risk Assessment
            </h3>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex items-center text-xs"
            >
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownload}
              className="flex items-center text-xs bg-pharmacy-blue hover:bg-pharmacy-darkBlue"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </div>

        <div className="p-6 bg-white print:p-8">
          <div className="border border-gray-300 rounded-lg p-6 print:border-black">
            <h1 className="text-xl font-bold text-center mb-6 print:text-black">
              Keswick Compounding Pharmacy – Non-sterile Compounding Risk Assessment
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-semibold print:text-black">Compound Name:</p>
                <p className="border-b border-gray-300 pb-1 print:border-black print:text-black">
                  {assessmentData.compoundName}
                </p>
              </div>
              <div>
                <p className="font-semibold print:text-black">DIN (Drug Identification Number):</p>
                <p className="border-b border-gray-300 pb-1 print:border-black print:text-black">
                  {assessmentData.din || "N/A"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-lg print:text-black">Active Pharmaceutical Ingredients (APIs):</h2>
              {assessmentData.activeIngredients.map((ingredient, index) => (
                <div key={index} className="mb-4 border-b border-gray-200 pb-4 print:border-black">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold print:text-black">API Name:</p>
                      <p className="print:text-black">{ingredient.name}</p>
                    </div>
                    <div>
                      <p className="font-semibold print:text-black">Manufacturer:</p>
                      <p className="print:text-black">{ingredient.manufacturer || "Not specified"}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="font-semibold print:text-black">
                        On NIOSH Antineoplastic Drug List:
                      </p>
                      <p className="print:text-black">
                        {ingredient.nioshStatus.isOnNioshList ? "Yes" : "No"}
                        {ingredient.nioshStatus.isOnNioshList && ingredient.nioshStatus.table && 
                          ` (${ingredient.nioshStatus.table})`}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold print:text-black">Toxic to reproduction:</p>
                      <p className="print:text-black">{ingredient.reproductiveToxicity ? "Yes" : "No"}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="font-semibold print:text-black">WHMIS Health Hazards:</p>
                    <p className="print:text-black">{ingredient.whmisHazards ? "Yes" : "No"}</p>
                  </div>
                  
                  <div className="mt-2">
                    <p className="font-semibold print:text-black">SDS Section 2 Description (Hazards):</p>
                    <p className="print:text-black">{ingredient.sdsDescription || "Not provided"}</p>
                  </div>
                  
                  <div className="mt-2">
                    <p className="font-semibold print:text-black">Product Monograph Contraindications/Warnings:</p>
                    <p className="print:text-black">{ingredient.monographWarnings || "Not provided"}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-lg print:text-black">Preparation Details:</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-semibold print:text-black">Frequency of Preparation:</p>
                  <p className="print:text-black">{assessmentData.preparationDetails.frequency}</p>
                </div>
                <div>
                  <p className="font-semibold print:text-black">Quantity Prepared (Average):</p>
                  <p className="print:text-black">{assessmentData.preparationDetails.quantity}</p>
                </div>
                <div>
                  <p className="font-semibold print:text-black">Concentration Health Risk:</p>
                  <p className="print:text-black">{assessmentData.preparationDetails.concentrationRisk ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-lg print:text-black">Physical Characteristics:</h2>
              <div className="flex flex-wrap gap-2">
                {assessmentData.physicalCharacteristics.map((characteristic, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded-md text-sm print:bg-white print:border print:border-black print:text-black">
                    {characteristic}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-lg print:text-black">Special Compounding Equipment Required:</h2>
              <div className="flex flex-wrap gap-2">
                {assessmentData.equipmentRequired.length > 0 ? (
                  assessmentData.equipmentRequired.map((equipment, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 rounded-md text-sm print:bg-white print:border print:border-black print:text-black">
                      {equipment}
                    </span>
                  ))
                ) : (
                  <span className="print:text-black">None required</span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-lg print:text-black">Additional Safety Checks:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold print:text-black">Special education/competencies required:</p>
                  <p className="print:text-black">
                    {assessmentData.safetyChecks.specialEducation.required ? 
                      `Yes: ${assessmentData.safetyChecks.specialEducation.description || ""}` : 
                      "No"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold print:text-black">Visual verification required:</p>
                  <p className="print:text-black">{assessmentData.safetyChecks.verificationRequired ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="font-semibold print:text-black">Appropriate facilities/equipment available:</p>
                  <p className="print:text-black">{assessmentData.safetyChecks.equipmentAvailable ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="font-semibold print:text-black">Ventilation required:</p>
                  <p className="print:text-black">{assessmentData.safetyChecks.ventilationRequired ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-lg print:text-black">Workflow Considerations:</h2>
              <div className="space-y-2">
                <div>
                  <p className="font-semibold print:text-black">Workflow uninterrupted:</p>
                  <p className="print:text-black">
                    {assessmentData.workflowConsiderations.uninterruptedWorkflow.status ? 
                      "Yes" : 
                      `No - Measures: ${assessmentData.workflowConsiderations.uninterruptedWorkflow.measures || "Not specified"}`}
                  </p>
                </div>
                <div>
                  <p className="font-semibold print:text-black">Risk of microbial contamination:</p>
                  <p className="print:text-black">
                    {assessmentData.workflowConsiderations.microbialContaminationRisk ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold print:text-black">Risk of cross-contamination:</p>
                  <p className="print:text-black">
                    {assessmentData.workflowConsiderations.crossContaminationRisk ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-lg print:text-black">Exposure Risks:</h2>
              <div className="flex flex-wrap gap-2">
                {assessmentData.exposureRisks.map((risk, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded-md text-sm print:bg-white print:border print:border-black print:text-black">
                    {risk}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-lg print:text-black">Personal Protective Equipment (PPE):</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold print:text-black">Gloves:</p>
                  <p className="print:text-black">{assessmentData.ppe.gloves}</p>
                </div>
                <div>
                  <p className="font-semibold print:text-black">Gown:</p>
                  <p className="print:text-black">{assessmentData.ppe.gown}</p>
                </div>
                <div>
                  <p className="font-semibold print:text-black">Mask:</p>
                  <p className="print:text-black">{assessmentData.ppe.mask}</p>
                </div>
                <div>
                  <p className="font-semibold print:text-black">Eye Protection:</p>
                  <p className="print:text-black">{assessmentData.ppe.eyeProtection ? "Yes" : "No"}</p>
                </div>
              </div>
              {assessmentData.ppe.otherPPE.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold print:text-black">Other PPE:</p>
                  <div className="flex flex-wrap gap-2">
                    {assessmentData.ppe.otherPPE.map((item, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 rounded-md text-sm print:bg-white print:border print:border-black print:text-black">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-lg print:text-black">Safety Equipment Required:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold print:text-black">Eye wash station:</p>
                  <p className="print:text-black">{assessmentData.safetyEquipment.eyeWashStation ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="font-semibold print:text-black">Safety shower:</p>
                  <p className="print:text-black">{assessmentData.safetyEquipment.safetyShower ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-lg print:text-black">Risk Level Assigned:</h2>
              <p className="font-bold text-lg print:text-black">{assessmentData.riskLevel}</p>
            </div>

            <div className="mb-4">
              <h2 className="font-semibold mb-2 text-lg print:text-black">Rationale for Risk Mitigation Measures:</h2>
              <p className="print:text-black">{assessmentData.rationale}</p>
            </div>

            <div className="mt-8 border-t pt-4 print:border-black">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold print:text-black">Assessment completed by:</p>
                  <p className="border-b border-gray-300 mt-6 print:border-black">&nbsp;</p>
                </div>
                <div>
                  <p className="font-semibold print:text-black">Date:</p>
                  <p className="border-b border-gray-300 mt-6 print:border-black">&nbsp;</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          variant="outline"
          onClick={onStartOver}
          className="flex items-center text-pharmacy-darkBlue hover:text-pharmacy-blue transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Process Another Document
        </Button>
      </div>
    </div>
  );
};

export default KeswickRiskAssessment;
