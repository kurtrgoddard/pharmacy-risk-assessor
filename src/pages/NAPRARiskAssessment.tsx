
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Form } from "@/components/ui/form";
import MobileFormWrapper from '@/components/ui/MobileFormWrapper';
import { riskAssessmentSchema } from '@/lib/validators/risk-assessment';
import { submitRiskAssessment } from '@/utils/api';
import AppHeader from '@/components/ui/AppHeader';
import AppFooter from '@/components/ui/AppFooter';
import SaveAssessmentDialog from '@/components/SaveAssessmentDialog';

// Import refactored components
import AssessmentFormHeader from '@/components/napra-assessment/AssessmentFormHeader';
import AssessmentFormSections from '@/components/napra-assessment/AssessmentFormSections';
import AssessmentReferencesSection from '@/components/napra-assessment/AssessmentReferencesSection';
import AssessmentFormActions from '@/components/napra-assessment/AssessmentFormActions';

const NAPRARiskAssessment = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof riskAssessmentSchema>>({
    resolver: zodResolver(riskAssessmentSchema),
    defaultValues: {
      pharmacyName: "",
      assessorName: "",
      assessmentDate: new Date(),
      preparationName: "",
      ingredients: "",
      processDescription: "",
      equipmentUsed: "",
      environmentalControls: "",
      stabilityData: "",
      sterilizationMethods: "",
      qualityControlMeasures: "",
      packagingMaterials: "",
      labelingPractices: "",
      storageConditions: "",
      riskLevel: "low",
      mitigationStrategies: "",
      residualRisk: "",
      references: "",
    },
  });

  // Check for loaded assessment data from sessionStorage
  useEffect(() => {
    const loadedAssessment = sessionStorage.getItem('loadedAssessment');
    if (loadedAssessment) {
      try {
        const data = JSON.parse(loadedAssessment);
        form.reset(data);
        sessionStorage.removeItem('loadedAssessment');
        toast.success('Assessment loaded successfully');
      } catch (error) {
        console.error('Error loading assessment:', error);
        toast.error('Failed to load assessment');
      }
    }
  }, [form]);

  async function onSubmit(values: z.infer<typeof riskAssessmentSchema>) {
    setIsSubmitting(true);
    try {
      const success = await submitRiskAssessment(values);
      if (success) {
        toast.success("Assessment submitted!", {
          description: "You'll be redirected to the dashboard.",
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        toast.error("Failed to submit assessment.", {
          description: "Please try again or contact support.",
        });
      }
    } catch (error) {
      toast.error("Submission error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentFormData = form.getValues();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader />
      
      <main className="flex-grow">
        <MobileFormWrapper className="py-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="outline" onClick={() => navigate('/')} className="mr-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              <h1 className="text-2xl font-semibold text-gray-900">NAPRA Risk Assessment</h1>
            </div>
            <SaveAssessmentDialog assessmentData={currentFormData} />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <AssessmentFormHeader control={form.control} />
              <AssessmentFormSections control={form.control} />
              <AssessmentReferencesSection control={form.control} />
              <AssessmentFormActions isSubmitting={isSubmitting} />
            </form>
          </Form>
        </MobileFormWrapper>
      </main>

      <AppFooter />
    </div>
  );
};

export default NAPRARiskAssessment;
