
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Form } from "@/components/ui/form";
import MobileFormWrapper from '@/components/ui/MobileFormWrapper';
import { riskAssessmentSchema } from '@/lib/validators/risk-assessment';
import { submitRiskAssessment } from '@/utils/api';
import AppHeader from '@/components/ui/AppHeader';
import AppFooter from '@/components/ui/AppFooter';

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader />
      
      <main className="flex-grow">
        <MobileFormWrapper className="py-8">
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
