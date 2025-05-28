
import React from 'react';
import { ArrowRight, FileInput, Zap, Download } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: <FileInput className="h-12 w-12 text-blue-600" />,
      title: "Enter Compound Ingredients",
      description: "Simply input your compound ingredients or upload your formulation. Our system recognizes thousands of pharmaceutical compounds.",
      time: "30 seconds"
    },
    {
      number: 2,
      icon: <Zap className="h-12 w-12 text-green-600" />,
      title: "Get Instant Risk Assessment",
      description: "Our AI analyzes safety data from multiple trusted sources and automatically calculates risk levels according to NAPRA standards.",
      time: "1 minute"
    },
    {
      number: 3,
      icon: <Download className="h-12 w-12 text-purple-600" />,
      title: "Download Compliance Report",
      description: "Receive a professional, NAPRA-compliant PDF report ready for regulatory submission and your quality assurance files.",
      time: "30 seconds"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get from compound ingredients to compliance report in under 2 minutes
          </p>
        </div>

        <div className="relative">
          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className="flex-1 text-center">
                    <div className="relative inline-block">
                      {/* Step Number */}
                      <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {step.number}
                      </div>
                      
                      {/* Icon Container */}
                      <div className="w-24 h-24 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center mx-auto mb-6">
                        {step.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 max-w-xs mx-auto">
                      {step.description}
                    </p>
                    
                    <div className="inline-flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                      <span className="text-green-800 text-sm font-medium">⏱️ {step.time}</span>
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <div className="flex-shrink-0 mx-8">
                      <ArrowRight className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative inline-block">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                  
                  {/* Icon Container */}
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center mx-auto mb-4">
                    {step.icon}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 mb-3 max-w-sm mx-auto text-sm">
                  {step.description}
                </p>
                
                <div className="inline-flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                  <span className="text-green-800 text-sm font-medium">⏱️ {step.time}</span>
                </div>
                
                {/* Mobile Arrow */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-6">
                    <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Total Time Callout */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-6 rounded-2xl">
            <div className="text-3xl font-bold mb-2">Total Time: Under 2 Minutes</div>
            <div className="text-green-100">vs. 30+ minutes with manual assessment</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
