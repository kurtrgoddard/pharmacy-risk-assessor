
import React from 'react';
import { Database, Shield, FileText, Clock, CheckCircle, BarChart3, Download, Users } from 'lucide-react';

const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: <Database className="h-8 w-8 text-blue-600" />,
      title: "Real-time Hazard Data",
      description: "Access to PubChem, NIOSH, and other trusted pharmaceutical databases for up-to-date safety information."
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Automatic NAPRA Compliance",
      description: "Built-in compliance checks ensure all assessments meet current NAPRA Model Standards requirements."
    },
    {
      icon: <FileText className="h-8 w-8 text-purple-600" />,
      title: "PDF Report Generation",
      description: "Professional, standardized reports ready for regulatory submission and documentation."
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: "95% Time Reduction",
      description: "Complete assessments in under 2 minutes instead of the typical 30+ minute manual process."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      title: "Automated Risk Classification",
      description: "AI-powered analysis automatically determines appropriate risk levels based on compound properties."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Assessment Analytics",
      description: "Track patterns, identify trends, and optimize your compounding workflow with detailed analytics."
    },
    {
      icon: <Download className="h-8 w-8 text-indigo-600" />,
      title: "Bulk Export & Integration",
      description: "Export data in multiple formats and integrate with existing pharmacy management systems."
    },
    {
      icon: <Users className="h-8 w-8 text-pink-600" />,
      title: "Multi-User Collaboration",
      description: "Share assessments across your team and maintain consistent risk evaluation standards."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Everything You Need for Risk Assessment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive features designed specifically for pharmaceutical professionals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-lg mb-4 group-hover:bg-blue-50 transition-colors">
                {feature.icon}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call-to-Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-6 py-3 rounded-full">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-medium">
              Join 500+ pharmacists already saving time with PharmAssess
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
