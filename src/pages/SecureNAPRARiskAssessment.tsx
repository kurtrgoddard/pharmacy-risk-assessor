
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SecureNAPRARiskAssessmentPage = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-pharmacy-neutral p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <Button variant="outline" onClick={handleBack} size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-pharmacy-darkBlue">
              Secure NAPRA Risk Assessment
            </h1>
            <p className="text-sm text-pharmacy-gray">
              Enhanced security version for sensitive compounds
            </p>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Secure Assessment Mode
            </CardTitle>
            <CardDescription>
              This secure version provides additional safety protocols for high-risk compounds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-pharmacy-gray mb-4">
              The secure assessment mode is currently under development and will be available in a future update.
            </p>
            <Button onClick={handleBack}>
              Return to Standard Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecureNAPRARiskAssessmentPage;
