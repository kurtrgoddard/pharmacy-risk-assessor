
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Loader2 } from 'lucide-react';
import { waitlistService } from '@/services/waitlistService';
import { trackUserAction } from '@/services/monitoring/analytics';

const WaitlistForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pharmacyName: '',
    province: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ position: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
    'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Basic validation
    if (!formData.name || !formData.email || !formData.pharmacyName || !formData.province) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = waitlistService.addToWaitlist(formData);
      
      if (result.success && result.position) {
        setSuccess({ position: result.position });
        trackUserAction('waitlist_signup', 'conversion', formData.province, result.position);
        
        // Send welcome email (placeholder)
        waitlistService.sendWelcomeEmail(formData.email, formData.name, result.position);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          pharmacyName: '',
          province: '',
          phone: ''
        });
      } else {
        setError(result.error || 'Failed to join waitlist');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-8 bg-green-50 rounded-2xl border border-green-200">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-900 mb-2">
          Welcome to the Waitlist!
        </h3>
        <p className="text-green-700 mb-4">
          You're <span className="font-bold">#{success.position}</span> on our waitlist!
        </p>
        <div className="space-y-2 text-sm text-green-600">
          <p>✅ Confirmation email sent</p>
          <p>✅ Early access reserved</p>
          <p>✅ Special pricing locked in</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setSuccess(null)}
          className="mt-4 border-green-600 text-green-600 hover:bg-green-50"
        >
          Add Another Person
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Dr. Jane Smith"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jane@pharmacy.com"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="pharmacy" className="text-sm font-medium text-gray-700">
            Pharmacy Name *
          </Label>
          <Input
            id="pharmacy"
            type="text"
            value={formData.pharmacyName}
            onChange={(e) => setFormData({ ...formData, pharmacyName: e.target.value })}
            placeholder="City Center Pharmacy"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="province" className="text-sm font-medium text-gray-700">
            Province/Territory *
          </Label>
          <Select value={formData.province} onValueChange={(value) => setFormData({ ...formData, province: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your province" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone Number (Optional)
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(555) 123-4567"
            className="mt-1"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3 h-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Joining Waitlist...
          </>
        ) : (
          'Join Waitlist - Get Early Access'
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By joining, you agree to receive updates about PharmAssess. Unsubscribe anytime.
      </p>
    </form>
  );
};

export default WaitlistForm;
