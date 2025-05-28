
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Beaker, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Upload,
  FileText,
  User,
  MapPin
} from "lucide-react";

const assessmentSchema = z.object({
  pharmacistName: z.string().min(1, "Pharmacist name is required"),
  pharmacyName: z.string().min(1, "Pharmacy name is required"),
  province: z.string().min(1, "Province is required"),
  compoundName: z.string().min(1, "Compound name is required"),
  ingredients: z.string().min(1, "Ingredients are required"),
  totalQuantity: z.string().min(1, "Total quantity is required"),
  dosageForm: z.string().min(1, "Dosage form is required"),
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

const PharmacistRiskAssessmentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [riskLevel, setRiskLevel] = useState<'A' | 'B' | 'C' | null>(null);

  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      pharmacistName: '',
      pharmacyName: '',
      province: '',
      compoundName: '',
      ingredients: '',
      totalQuantity: '',
      dosageForm: ''
    }
  });

  const canadianProvinces = [
    { code: 'AB', name: 'Alberta' },
    { code: 'BC', name: 'British Columbia' },
    { code: 'MB', name: 'Manitoba' },
    { code: 'NB', name: 'New Brunswick' },
    { code: 'NL', name: 'Newfoundland and Labrador' },
    { code: 'NS', name: 'Nova Scotia' },
    { code: 'ON', name: 'Ontario' },
    { code: 'PE', name: 'Prince Edward Island' },
    { code: 'QC', name: 'Quebec' },
    { code: 'SK', name: 'Saskatchewan' },
    { code: 'NT', name: 'Northwest Territories' },
    { code: 'NU', name: 'Nunavut' },
    { code: 'YT', name: 'Yukon' }
  ];

  const handleSubmit = async (data: AssessmentFormData) => {
    setIsSubmitting(true);
    
    // Simulate risk assessment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock risk determination based on ingredients
    const ingredients = data.ingredients.toLowerCase();
    let determinedRisk: 'A' | 'B' | 'C' = 'A';
    
    if (ingredients.includes('morphine') || ingredients.includes('fentanyl') || 
        ingredients.includes('chemotherapy') || ingredients.includes('cytotoxic')) {
      determinedRisk = 'C';
    } else if (ingredients.includes('hormone') || ingredients.includes('tretinoin') || 
               ingredients.includes('powder') || ingredients.includes('capsule')) {
      determinedRisk = 'B';
    }
    
    setRiskLevel(determinedRisk);
    setIsSubmitting(false);
    
    toast.success(`Risk assessment completed - NAPRA Level ${determinedRisk}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Beaker className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">NAPRA Risk Assessment</CardTitle>
              <CardDescription>
                Complete compounding risk assessment for Canadian pharmacy compliance
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Pharmacy Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pharmacistName">
                  <User className="inline h-4 w-4 mr-2" />
                  Pharmacist Name
                </Label>
                <Input
                  id="pharmacistName"
                  {...form.register('pharmacistName')}
                  placeholder="Dr. Sarah Johnson, PharmD"
                />
                {form.formState.errors.pharmacistName && (
                  <p className="text-sm text-red-600">{form.formState.errors.pharmacistName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pharmacyName">Pharmacy Name</Label>
                <Input
                  id="pharmacyName"
                  {...form.register('pharmacyName')}
                  placeholder="Toronto General Hospital Pharmacy"
                />
                {form.formState.errors.pharmacyName && (
                  <p className="text-sm text-red-600">{form.formState.errors.pharmacyName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">
                <MapPin className="inline h-4 w-4 mr-2" />
                Province/Territory
              </Label>
              <Select onValueChange={(value) => form.setValue('province', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your province/territory" />
                </SelectTrigger>
                <SelectContent>
                  {canadianProvinces.map((province) => (
                    <SelectItem key={province.code} value={province.code}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.province && (
                <p className="text-sm text-red-600">{form.formState.errors.province.message}</p>
              )}
            </div>

            {/* Compound Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Compound Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="compoundName">Compound Name</Label>
                  <Input
                    id="compoundName"
                    {...form.register('compoundName')}
                    placeholder="Ketoprofen 10% PLO Gel"
                  />
                  {form.formState.errors.compoundName && (
                    <p className="text-sm text-red-600">{form.formState.errors.compoundName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dosageForm">Dosage Form</Label>
                  <Select onValueChange={(value) => form.setValue('dosageForm', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dosage form" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cream">Cream</SelectItem>
                      <SelectItem value="ointment">Ointment</SelectItem>
                      <SelectItem value="gel">Gel</SelectItem>
                      <SelectItem value="solution">Solution</SelectItem>
                      <SelectItem value="suspension">Suspension</SelectItem>
                      <SelectItem value="capsule">Capsule</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="suppository">Suppository</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.dosageForm && (
                    <p className="text-sm text-red-600">{form.formState.errors.dosageForm.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="totalQuantity">Total Quantity</Label>
                <Input
                  id="totalQuantity"
                  {...form.register('totalQuantity')}
                  placeholder="100g"
                />
                {form.formState.errors.totalQuantity && (
                  <p className="text-sm text-red-600">{form.formState.errors.totalQuantity.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">
                  Ingredients & Concentrations
                  <span className="text-sm text-gray-500 ml-2">
                    (List all active and inactive ingredients with concentrations)
                  </span>
                </Label>
                <Textarea
                  id="ingredients"
                  {...form.register('ingredients')}
                  placeholder="Ketoprofen 10%&#10;PLO Gel Base q.s. to 100g&#10;Preservative: Methylparaben 0.1%"
                  rows={4}
                />
                {form.formState.errors.ingredients && (
                  <p className="text-sm text-red-600">{form.formState.errors.ingredients.message}</p>
                )}
              </div>
            </div>

            {/* Upload Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Supporting Documents</h3>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Formula
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Upload prescription, compound formula, or SDS documents to automatically extract ingredient information.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing Risk Level...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Complete Risk Assessment
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Card */}
      {riskLevel && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Assessment Complete
              </CardTitle>
              <Badge 
                variant={riskLevel === 'C' ? 'destructive' : riskLevel === 'B' ? 'default' : 'secondary'}
                className="text-lg px-3 py-1"
              >
                NAPRA Level {riskLevel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Required Safety Measures:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {riskLevel === 'A' && (
                    <>
                      <li>• Standard compounding area acceptable</li>
                      <li>• Basic PPE: nitrile gloves, safety glasses</li>
                      <li>• Good general ventilation</li>
                    </>
                  )}
                  {riskLevel === 'B' && (
                    <>
                      <li>• Dedicated compounding area required</li>
                      <li>• Enhanced PPE: double gloves, gown, face shield</li>
                      <li>• Powder containment hood or BSC</li>
                      <li>• Enhanced training required</li>
                    </>
                  )}
                  {riskLevel === 'C' && (
                    <>
                      <li>• Containment isolator or Class II Type B2 BSC required</li>
                      <li>• Full hazmat PPE including respirator</li>
                      <li>• Negative pressure room</li>
                      <li>• Specialized training and certification</li>
                      <li>• Pregnant/nursing staff restrictions</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="flex space-x-4">
                <Button className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate PDF Report
                </Button>
                <Button variant="outline" className="flex-1">
                  Save Assessment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PharmacistRiskAssessmentForm;
