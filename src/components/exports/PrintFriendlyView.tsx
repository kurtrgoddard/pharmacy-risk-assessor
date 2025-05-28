
import React from 'react';
import { RiskAssessmentData } from '@/lib/validators/risk-assessment';
import { KeswickAssessmentData } from '@/components/KeswickRiskAssessment';

interface PrintFriendlyViewProps {
  assessment: RiskAssessmentData | KeswickAssessmentData;
  qrCodeUrl?: string;
}

const PrintFriendlyView: React.FC<PrintFriendlyViewProps> = ({ 
  assessment, 
  qrCodeUrl 
}) => {
  const isKeswick = 'compoundName' in assessment;
  const keswickData = isKeswick ? assessment as KeswickAssessmentData : null;
  const napraData = !isKeswick ? assessment as RiskAssessmentData : null;

  return (
    <div className="print-view bg-white text-black p-8 max-w-4xl mx-auto">
      <style jsx>{`
        @media print {
          .print-view {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 20px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Header */}
      <div className="border-b-2 border-gray-300 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              NAPRA Risk Assessment
            </h1>
            <p className="text-gray-600 mt-1">
              Non-Sterile Compounding Risk Assessment
            </p>
          </div>
          {qrCodeUrl && (
            <div className="text-center">
              <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20 mx-auto" />
              <p className="text-xs text-gray-500 mt-1">Scan for digital copy</p>
            </div>
          )}
        </div>
      </div>

      {/* Assessment Details */}
      {keswickData ? (
        <div className="space-y-6">
          {/* Compound Information */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              Compound Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Compound Name:</strong> {keswickData.compoundName}</p>
                <p><strong>DIN:</strong> {keswickData.din}</p>
              </div>
              <div>
                <p><strong>Risk Level:</strong> {keswickData.riskLevel}</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </section>

          {/* Active Ingredients */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              Active Ingredients
            </h2>
            {keswickData.activeIngredients.map((ingredient, index) => (
              <div key={index} className="mb-2">
                <p><strong>{ingredient.name}</strong> ({ingredient.manufacturer})</p>
                <p className="text-sm text-gray-600">
                  NIOSH Status: {ingredient.nioshStatus.hazardLevel}
                  {ingredient.reproductiveToxicity && ' | Reproductive Toxicity'}
                  {ingredient.whmisHazards && ' | WHMIS Hazards'}
                </p>
              </div>
            ))}
          </section>

          {/* PPE Requirements */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              Personal Protective Equipment
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Gloves:</strong> {keswickData.ppe.gloves}</p>
                <p><strong>Gown:</strong> {keswickData.ppe.gown}</p>
              </div>
              <div>
                <p><strong>Mask:</strong> {keswickData.ppe.mask}</p>
                <p><strong>Eye Protection:</strong> {keswickData.ppe.eyeProtection ? 'Required' : 'Not Required'}</p>
              </div>
            </div>
          </section>

          {/* Rationale */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              Risk Assessment Rationale
            </h2>
            <p className="text-gray-700">{keswickData.rationale}</p>
          </section>
        </div>
      ) : napraData && (
        <div className="space-y-6">
          {/* Basic Information */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              Assessment Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Pharmacy:</strong> {napraData.pharmacyName}</p>
                <p><strong>Assessor:</strong> {napraData.assessorName}</p>
                <p><strong>Preparation:</strong> {napraData.preparationName}</p>
              </div>
              <div>
                <p><strong>Date:</strong> {napraData.assessmentDate.toLocaleDateString()}</p>
                <p><strong>Risk Level:</strong> {napraData.riskLevel}</p>
              </div>
            </div>
          </section>

          {/* Ingredients and Process */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              Preparation Details
            </h2>
            <div className="space-y-3">
              <div>
                <p><strong>Ingredients:</strong></p>
                <p className="text-gray-700 ml-4">{napraData.ingredients}</p>
              </div>
              <div>
                <p><strong>Process Description:</strong></p>
                <p className="text-gray-700 ml-4">{napraData.processDescription}</p>
              </div>
              <div>
                <p><strong>Equipment Used:</strong></p>
                <p className="text-gray-700 ml-4">{napraData.equipmentUsed}</p>
              </div>
            </div>
          </section>

          {/* Risk Assessment */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              Risk Assessment
            </h2>
            <div className="space-y-3">
              <div>
                <p><strong>Mitigation Strategies:</strong></p>
                <p className="text-gray-700 ml-4">{napraData.mitigationStrategies}</p>
              </div>
              <div>
                <p><strong>Residual Risk:</strong></p>
                <p className="text-gray-700 ml-4">{napraData.residualRisk}</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>Generated by NAPRA Risk Assessment Tool - {new Date().toLocaleString()}</p>
        <p>This document contains confidential pharmaceutical information</p>
      </div>
    </div>
  );
};

export default PrintFriendlyView;
