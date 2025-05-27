import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import MobileFormWrapper from '@/components/ui/MobileFormWrapper';
import { riskAssessmentSchema } from '@/lib/validators/risk-assessment';
import { submitRiskAssessment } from '@/utils/api';
import AppHeader from '@/components/ui/AppHeader';
import AppFooter from '@/components/ui/AppFooter';

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
        toast({
          title: "Assessment submitted!",
          description: "You'll be redirected to the dashboard.",
          action: <a href="/dashboard">View Dashboard</a>,
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        toast({
          title: "Failed to submit assessment.",
          description: "Please try again or contact support.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Submission error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pharmacyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pharmacy Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pharmacy name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assessorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter assessor name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="assessmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assessment Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preparationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preparation Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter preparation name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    Ingredient Details
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="ingredients"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>List of Ingredients</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List all ingredients and their concentrations"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Process Description
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="processDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detailed Process Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the preparation process step by step"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Equipment and Environment
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="equipmentUsed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Equipment Used</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List all equipment used during preparation"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="environmentalControls"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Environmental Controls</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe environmental controls (e.g., ISO class)"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Quality and Stability
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="stabilityData"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stability Data</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Summarize stability data for the preparation"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sterilizationMethods"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sterilization Methods</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe sterilization methods used, if applicable"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="qualityControlMeasures"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quality Control Measures</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List quality control measures implemented"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    Packaging and Storage
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="packagingMaterials"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Packaging Materials</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe packaging materials used"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="labelingPractices"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Labeling Practices</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe labeling practices followed"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="storageConditions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Storage Conditions</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Specify storage conditions required"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>
                    Risk Assessment and Mitigation
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="riskLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Risk Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a risk level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mitigationStrategies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mitigation Strategies</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe strategies to mitigate identified risks"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="residualRisk"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Residual Risk</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the residual risk after mitigation"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <FormField
                control={form.control}
                name="references"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>References</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List any references used for the assessment"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Discard
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. All data will be lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => navigate('/')}>Discard</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Assessment"}
                </Button>
              </div>
            </form>
          </Form>
        </MobileFormWrapper>
      </main>

      <AppFooter />
    </div>
  );
};

export default NAPRARiskAssessment;
