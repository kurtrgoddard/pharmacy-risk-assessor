
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Mail, MapPin, Building2, UserCheck } from "lucide-react";

const WaitlistForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pharmacy: '',
    province: '',
    position: '',
    currentProcess: '',
    interests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Welcome to the waitlist!", {
      description: "You'll be notified when PharmAssess launches."
    });
    
    setIsSubmitting(false);
    setFormData({
      name: '',
      email: '',
      pharmacy: '',
      province: '',
      position: '',
      currentProcess: '',
      interests: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-blue-600">Join the PharmAssess Waitlist</CardTitle>
          <CardDescription className="text-lg">
            Be among the first to experience 2-minute NAPRA-compliant risk assessments
          </CardDescription>
          <div className="flex justify-center space-x-4 mt-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              500+ Pharmacists Waiting
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              50% Early Bird Discount
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Dr. Sarah Johnson"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="sarah@pharmacy.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pharmacy">Pharmacy/Organization *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="pharmacy"
                    type="text"
                    value={formData.pharmacy}
                    onChange={(e) => handleInputChange('pharmacy', e.target.value)}
                    placeholder="Toronto General Hospital"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Province *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="province"
                    type="text"
                    value={formData.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    placeholder="Ontario"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position/Role *</Label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="position"
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="Clinical Pharmacist, Pharmacy Director, etc."
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentProcess">Current Risk Assessment Process</Label>
              <Textarea
                id="currentProcess"
                value={formData.currentProcess}
                onChange={(e) => handleInputChange('currentProcess', e.target.value)}
                placeholder="Describe your current approach to compound risk assessment..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">What features interest you most?</Label>
              <Textarea
                id="interests"
                value={formData.interests}
                onChange={(e) => handleInputChange('interests', e.target.value)}
                placeholder="Real-time hazard data, automated compliance checking, PDF reports..."
                rows={3}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">What You'll Get:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Early access to PharmAssess platform</li>
                <li>• 50% discount on first year subscription</li>
                <li>• Priority support and training</li>
                <li>• Influence on feature development</li>
              </ul>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              size="lg"
              disabled={isSubmitting}
            >
              <Mail className="mr-2 h-5 w-5" />
              {isSubmitting ? 'Joining Waitlist...' : 'Join Waitlist - Get 50% Off'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>We respect your privacy. Unsubscribe at any time.</p>
            <p className="mt-1">No spam, just updates on PharmAssess development.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitlistForm;
