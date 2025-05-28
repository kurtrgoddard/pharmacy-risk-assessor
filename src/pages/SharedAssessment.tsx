
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExportService } from '@/services/exportService';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import KeswickRiskAssessment from '@/components/KeswickRiskAssessment';
import { KeswickAssessmentData } from '@/components/KeswickRiskAssessment';
import { RiskAssessmentData } from '@/lib/validators/risk-assessment';
import PrintFriendlyView from '@/components/exports/PrintFriendlyView';

const SharedAssessment = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<KeswickAssessmentData | RiskAssessmentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shareId) {
      setError('Invalid share link');
      setLoading(false);
      return;
    }

    const sharedAssessment = ExportService.getSharedAssessment(shareId);
    
    if (!sharedAssessment) {
      setError('This assessment link has expired or is invalid');
      setLoading(false);
      return;
    }

    setAssessment(sharedAssessment.data);
    setLoading(false);
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pharmacy-blue mx-auto"></div>
          <p className="mt-4 text-pharmacy-gray">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Assessment Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'The assessment you\'re looking for could not be found.'}
          </p>
          <Button onClick={() => navigate('/')} className="bg-pharmacy-blue hover:bg-pharmacy-darkBlue">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  const isKeswick = 'compoundName' in assessment;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">Shared Assessment</h3>
                <p className="text-sm text-blue-700">
                  This is a shared risk assessment. You're viewing a read-only copy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {isKeswick ? (
          <KeswickRiskAssessment
            assessmentData={assessment as KeswickAssessmentData}
            fileName={`shared-${(assessment as KeswickAssessmentData).compoundName}`}
            onStartOver={() => navigate('/')}
          />
        ) : (
          <PrintFriendlyView assessment={assessment} />
        )}
      </div>
    </div>
  );
};

export default SharedAssessment;
