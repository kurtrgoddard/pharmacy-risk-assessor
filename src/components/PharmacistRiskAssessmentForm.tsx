
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Building2, 
  User, 
  Calendar, 
  Flask, 
  AlertTriangle, 
  ShieldCheck,
  Clock,
  FileText,
  Info
} from "lucide-react";
import { toast } from "sonner";

interface PharmacistRiskAssessmentFormProps {
  onSubmit: (data: any) => void;
}

const PharmacistRiskAssessmentForm: React.FC<PharmacistRiskAssessmentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    // Pharmacy Information
    pharmacyName: '',
    pharmacyType: '',
    assessorName: '',
    assessorLicense: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    
    // Compound Information
    preparationName: '',
    din: '',
    batchSize: '',
    dosageForm: '',
    frequency: '',
    
    // Ingredients
    ingredients: [{ name: '', strength: '', concentration: '', manufacturer: '' }],
    
    // Process Details
    preparationMethod: '',
    equipmentRequired: [],
    timeRequired: '',
    
    // Risk Factors
    riskFactors: {
      nioshListed: false,
      reproductiveToxicity: false,
      carcinogenic: false,
      powderForm: false,
      volatileIngredients: false,
      highPotency: false
    },
    
    // Environmental Controls
    ventilationRequired: '',
    cleanroomRequired: false,
    specialHandling: '',
    
    // PPE Requirements
    ppeRequired: {
      gloves: '',
      gown: '',
      mask: '',
      eyeProtection: false,
      other: []
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const pharmacyTypes = [
    "Community Pharmacy",
    "Hospital Pharmacy", 
    "Clinical Pharmacy",
    "Compounding Pharmacy",
    "Long-term Care Pharmacy"
  ];

  const dosageForms = [
    "Capsule",
    "Tablet", 
    "Oral Solution",
    "Oral Suspension",
    "Topical Cream",
    "Topical Ointment",
    "Topical Gel",
    "Injectable Solution",
    "Suppository",
    "Other"
  ];

  const preparationMethods = [
    "Simple mixing",
    "Mortar and pestle",
    "Ointment mill",
    "Electronic mortar",
    "Hot plate mixing",
    "Magnetic stirrer",
    "Homogenizer",
    "Other"
  ];

  const equipmentOptions = [
    "Analytical balance",
    "Ointment mill",
    "Mortar and pestle", 
    "Magnetic stirrer",
    "Hot plate",
    "Capsule machine",
    "Suppository molds",
    "pH meter",
    "Other"
  ];

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', strength: '', concentration: '', manufacturer: '' }]
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = ['pharmacyName', 'assessorName', 'preparationName'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.ingredients.some(ing => !ing.name)) {
      toast.error("Please specify all ingredient names");
      return;
    }

    toast.success("Starting risk assessment analysis...");
    onSubmit(formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Pharmacy Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pharmacyName">Pharmacy Name *</Label>
                <Input
                  id="pharmacyName"
                  value={formData.pharmacyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, pharmacyName: e.target.value }))}
                  placeholder="e.g., Shoppers Drug Mart #1234"
                />
              </div>
              
              <div>
                <Label htmlFor="pharmacyType">Pharmacy Type</Label>
                <Select 
                  value={formData.pharmacyType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, pharmacyType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pharmacy type" />
                  </SelectTrigger>
                  <SelectContent>
                    {pharmacyTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="assessorName">Pharmacist Name *</Label>
                <Input
                  id="assessorName"
                  value={formData.assessorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, assessorName: e.target.value }))}
                  placeholder="e.g., Dr. Sarah Chen"
                />
              </div>
              
              <div>
                <Label htmlFor="assessorLicense">License Number</Label>
                <Input
                  id="assessorLicense"
                  value={formData.assessorLicense}
                  onChange={(e) => setFormData(prev => ({ ...prev, assessorLicense: e.target.value }))}
                  placeholder="e.g., 12345"
                />
              </div>
              
              <div>
                <Label htmlFor="assessmentDate">Assessment Date</Label>
                <Input
                  id="assessmentDate"
                  type="date"
                  value={formData.assessmentDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, assessmentDate: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Flask className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Compound Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preparationName">Preparation Name *</Label>
                <Input
                  id="preparationName"
                  value={formData.preparationName}
                  onChange={(e) => setFormData(prev => ({ ...prev, preparationName: e.target.value }))}
                  placeholder="e.g., Ketoprofen 10% PLO Gel"
                />
              </div>
              
              <div>
                <Label htmlFor="din">DIN (if applicable)</Label>
                <Input
                  id="din"
                  value={formData.din}
                  onChange={(e) => setFormData(prev => ({ ...prev, din: e.target.value }))}
                  placeholder="e.g., 12345678"
                />
              </div>
              
              <div>
                <Label htmlFor="dosageForm">Dosage Form</Label>
                <Select 
                  value={formData.dosageForm} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, dosageForm: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select dosage form" />
                  </SelectTrigger>
                  <SelectContent>
                    {dosageForms.map(form => (
                      <SelectItem key={form} value={form}>{form}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="batchSize">Batch Size</Label>
                <Input
                  id="batchSize"
                  value={formData.batchSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, batchSize: e.target.value }))}
                  placeholder="e.g., 100g, 30 capsules"
                />
              </div>
              
              <div>
                <Label htmlFor="frequency">Preparation Frequency</Label>
                <Select 
                  value={formData.frequency} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How often is this prepared?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="occasionally">Occasionally</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold">Ingredients</h3>
            </div>
            
            {formData.ingredients.map((ingredient, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Ingredient Name *</Label>
                    <Input
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      placeholder="e.g., Ketoprofen"
                    />
                  </div>
                  <div>
                    <Label>Strength/Concentration</Label>
                    <Input
                      value={ingredient.concentration}
                      onChange={(e) => updateIngredient(index, 'concentration', e.target.value)}
                      placeholder="e.g., 10%"
                    />
                  </div>
                  <div>
                    <Label>Manufacturer</Label>
                    <Input
                      value={ingredient.manufacturer}
                      onChange={(e) => updateIngredient(index, 'manufacturer', e.target.value)}
                      placeholder="e.g., PCCA"
                    />
                  </div>
                  <div className="flex items-end">
                    {formData.ingredients.length > 1 && (
                      <Button 
                        variant="outline" 
                        onClick={() => removeIngredient(index)}
                        className="w-full"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            
            <Button onClick={addIngredient} variant="outline" className="w-full">
              + Add Another Ingredient
            </Button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Risk Assessment</h3>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Check all risk factors that apply to this preparation. PharmAssess will automatically verify these against NIOSH and other databases.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-medium mb-3">Hazard Classifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nioshListed"
                      checked={formData.riskFactors.nioshListed}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          riskFactors: { ...prev.riskFactors, nioshListed: !!checked }
                        }))
                      }
                    />
                    <Label htmlFor="nioshListed">NIOSH Listed Hazardous Drug</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="reproductiveToxicity"
                      checked={formData.riskFactors.reproductiveToxicity}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          riskFactors: { ...prev.riskFactors, reproductiveToxicity: !!checked }
                        }))
                      }
                    />
                    <Label htmlFor="reproductiveToxicity">Reproductive Toxicity</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="carcinogenic"
                      checked={formData.riskFactors.carcinogenic}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          riskFactors: { ...prev.riskFactors, carcinogenic: !!checked }
                        }))
                      }
                    />
                    <Label htmlFor="carcinogenic">Carcinogenic</Label>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-3">Physical Characteristics</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="powderForm"
                      checked={formData.riskFactors.powderForm}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          riskFactors: { ...prev.riskFactors, powderForm: !!checked }
                        }))
                      }
                    />
                    <Label htmlFor="powderForm">Powder/Dust Form</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="volatileIngredients"
                      checked={formData.riskFactors.volatileIngredients}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          riskFactors: { ...prev.riskFactors, volatileIngredients: !!checked }
                        }))
                      }
                    />
                    <Label htmlFor="volatileIngredients">Volatile Ingredients</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="highPotency"
                      checked={formData.riskFactors.highPotency}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          riskFactors: { ...prev.riskFactors, highPotency: !!checked }
                        }))
                      }
                    />
                    <Label htmlFor="highPotency">High Potency Drug</Label>
                  </div>
                </div>
              </Card>
            </div>
            
            <div>
              <Label htmlFor="preparationMethod">Preparation Method</Label>
              <Select 
                value={formData.preparationMethod} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, preparationMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preparation method" />
                </SelectTrigger>
                <SelectContent>
                  {preparationMethods.map(method => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold">Review & Submit</h3>
            </div>
            
            <Alert>
              <ShieldCheck className="h-4 w-4" />
              <AlertDescription>
                Review your information below. PharmAssess will analyze this data and generate a NAPRA-compliant risk assessment.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-medium mb-3">Pharmacy Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Pharmacy:</strong> {formData.pharmacyName}</div>
                  <div><strong>Pharmacist:</strong> {formData.assessorName}</div>
                  <div><strong>Date:</strong> {formData.assessmentDate}</div>
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-3">Compound Details</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Preparation:</strong> {formData.preparationName}</div>
                  <div><strong>Dosage Form:</strong> {formData.dosageForm}</div>
                  <div><strong>Batch Size:</strong> {formData.batchSize}</div>
                </div>
              </Card>
              
              <Card className="p-4 md:col-span-2">
                <h4 className="font-medium mb-3">Ingredients</h4>
                <div className="space-y-1 text-sm">
                  {formData.ingredients.map((ing, index) => (
                    <div key={index}>
                      {ing.name} {ing.concentration && `(${ing.concentration})`}
                      {ing.manufacturer && ` - ${ing.manufacturer}`}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>NAPRA Risk Assessment</span>
                <Badge variant="secondary">Step {currentStep} of {totalSteps}</Badge>
              </CardTitle>
              <CardDescription>
                Complete this form to generate a NAPRA-compliant risk assessment
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">~2 minutes</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            {renderStep()}
            
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  Previous
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button 
                  type="button" 
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" className="ml-auto bg-green-600 hover:bg-green-700">
                  Generate Risk Assessment
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmacistRiskAssessmentForm;
