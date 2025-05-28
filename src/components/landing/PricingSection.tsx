
import React from 'react';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: 'Basic',
      price: 99,
      period: 'month',
      description: 'Perfect for small pharmacies',
      features: [
        'Up to 50 assessments/month',
        'NAPRA-compliant reports',
        'Email support',
        'Basic analytics',
        'PDF export'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: 299,
      period: 'month',
      description: 'Most popular for growing pharmacies',
      features: [
        'Unlimited assessments',
        'Advanced risk analytics',
        'Priority support',
        'Custom branding',
        'API integration',
        'Team collaboration',
        'Advanced reporting'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 599,
      period: 'month',
      description: 'For large pharmacy chains',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Custom integrations',
        'White-label solution',
        'Advanced compliance tools',
        'Training sessions',
        'SLA guarantee'
      ],
      popular: false
    }
  ];

  const handleWaitlistClick = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your pharmacy's needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                plan.popular ? 'border-blue-500 transform scale-105' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">CAD/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={handleWaitlistClick}
                className={`w-full ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                Join Waitlist
              </Button>
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">Pricing Coming Soon</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            We're finalizing our pricing structure based on feedback from Canadian pharmacists. 
            Join our waitlist to get exclusive early bird pricing with up to 50% off these rates!
          </p>
          <Button
            onClick={handleWaitlistClick}
            variant="outline"
            className="bg-white text-blue-600 hover:bg-blue-50 border-white"
          >
            Get Early Bird Pricing
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
