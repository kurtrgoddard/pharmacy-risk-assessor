
import React from 'react';
import { RiskAssessmentData } from '@/lib/validators/risk-assessment';
import { KeswickAssessmentData } from '@/components/KeswickRiskAssessment';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PrintFriendlyViewProps {
  assessment: RiskAssessmentData | KeswickAssessmentData;
  qrCodeUrl?: string;
}

// Type guard to check if assessment is KeswickAssessmentData
const isKeswickAssessment = (assessment: any): assessment is KeswickAssessmentData => {
  return 'compoundName' in assessment && 'activeIngredients' in assessment;
};

const PrintFriendlyView: React.FC<PrintFriendlyViewProps> = ({ assessment, qrCodeUrl }) => {
  return (
    <div className="print-friendly-view max-w-4xl mx-auto p-8 bg-white">
      <style>
        {`
          @media print {
            body { font-size: 12pt; }
            .print-friendly-view { margin: 0; }
            .no-print { display: none !important; }
          }
        `}
      </style>
      
      <div className="header mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          Risk Assessment Report
        </h1>
        <div className="text-center text-gray-600 mb-6">
          Generated on {new Date().toLocaleDateString()}
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Compound Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {isKeswickAssessment(assessment) ? (
              <>
                <div>
                  <strong>Compound Name:</strong> {assessment.compoundName}
                </div>
                <div>
                  <strong>DIN:</strong> {assessment.din || 'N/A'}
                </div>
                <div>
                  <strong>Risk Level:</strong> {assessment.riskLevel}
                </div>
                <div>
                  <strong>Preparation Frequency:</strong> {assessment.preparationDetails.frequency}
                </div>
              </>
            ) : (
              <>
                <div>
                  <strong>Pharmacy Name:</strong> {assessment.pharmacyName || 'N/A'}
                </div>
                <div>
                  <strong>Preparation Name:</strong> {assessment.preparationName || 'N/A'}
                </div>
                <div>
                  <strong>Assessor:</strong> {assessment.assessorName || 'N/A'}
                </div>
                <div>
                  <strong>Storage:</strong> {assessment.storageConditions || 'N/A'}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {isKeswickAssessment(assessment) && assessment.activeIngredients && assessment.activeIngredients.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Active Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {assessment.activeIngredients.map((ingredient, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{ingredient.name}</span>
                  <span className="font-medium">{ingredient.manufacturer || 'N/A'}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!isKeswickAssessment(assessment) && assessment.ingredients && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{assessment.ingredients}</p>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <strong>Overall Risk Level:</strong>
              <Badge variant={
                assessment.riskLevel === 'high' || assessment.riskLevel === 'Level C' ? 'destructive' : 
                assessment.riskLevel === 'medium' || assessment.riskLevel === 'Level B' ? 'default' : 
                'secondary'
              }>
                {assessment.riskLevel?.toUpperCase()}
              </Badge>
            </div>
          </div>
          
          {isKeswickAssessment(assessment) && assessment.rationale && (
            <div className="mb-4">
              <strong>Risk Rationale:</strong>
              <p className="mt-2 text-sm">{assessment.rationale}</p>
            </div>
          )}

          {!isKeswickAssessment(assessment) && assessment.mitigationStrategies && (
            <div className="mb-4">
              <strong>Mitigation Strategies:</strong>
              <p className="mt-2 text-sm">{assessment.mitigationStrategies}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {isKeswickAssessment(assessment) && assessment.ppe && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personal Protective Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Gloves:</strong> {assessment.ppe.gloves}
              </div>
              <div>
                <strong>Gown:</strong> {assessment.ppe.gown}
              </div>
              <div>
                <strong>Mask:</strong> {assessment.ppe.mask}
              </div>
              <div>
                <strong>Eye Protection:</strong> {assessment.ppe.eyeProtection ? 'Required' : 'Not Required'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {qrCodeUrl && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Digital Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <img src={qrCodeUrl} alt="QR Code for digital access" className="w-24 h-24" />
              <div>
                <p className="text-sm text-gray-600">
                  Scan this QR code to access the digital version of this assessment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="footer mt-8 pt-4 border-t text-sm text-gray-600">
        <p>This assessment was generated using automated risk assessment tools.</p>
        <p>Please review and validate all recommendations before implementation.</p>
      </div>
    </div>
  );
};

export default PrintFriendlyView;
