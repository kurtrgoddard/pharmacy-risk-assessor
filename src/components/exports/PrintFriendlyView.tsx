
import React from 'react';
import { RiskAssessmentData } from '@/lib/validators/risk-assessment';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PrintFriendlyViewProps {
  assessment: RiskAssessmentData;
}

const PrintFriendlyView: React.FC<PrintFriendlyViewProps> = ({ assessment }) => {
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
            <div>
              <strong>Compound Name:</strong> {assessment.compoundName}
            </div>
            <div>
              <strong>Batch Size:</strong> {assessment.batchSize}
            </div>
            <div>
              <strong>Dosage Form:</strong> {assessment.dosageForm}
            </div>
            <div>
              <strong>Storage:</strong> {assessment.storageConditions}
            </div>
          </div>
        </CardContent>
      </Card>

      {assessment.ingredients && assessment.ingredients.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Active Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {assessment.ingredients.map((ingredient, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{ingredient.name}</span>
                  <span className="font-medium">{ingredient.concentration}</span>
                </div>
              ))}
            </div>
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
                assessment.riskLevel === 'high' ? 'destructive' : 
                assessment.riskLevel === 'medium' ? 'default' : 
                'secondary'
              }>
                {assessment.riskLevel?.toUpperCase()}
              </Badge>
            </div>
          </div>
          
          {assessment.hazardClassification && (
            <div className="mb-4">
              <strong>Hazard Classifications:</strong>
              <div className="mt-2 space-y-1">
                {assessment.hazardClassification.ghs?.map((hazard, index) => (
                  <div key={index} className="text-sm bg-yellow-50 p-2 rounded">
                    {hazard}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {assessment.recommendedPPE && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personal Protective Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Gloves:</strong> {assessment.recommendedPPE.gloves}
              </div>
              <div>
                <strong>Eye Protection:</strong> {assessment.recommendedPPE.eyeProtection}
              </div>
              <div>
                <strong>Respiratory:</strong> {assessment.recommendedPPE.respiratoryProtection}
              </div>
              <div>
                <strong>Body Protection:</strong> {assessment.recommendedPPE.bodyProtection}
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
