
import React from 'react';
import { Clock, AlertTriangle, FileX, CheckCircle, Zap, Shield } from 'lucide-react';

const ProblemSolutionSection: React.FC = () => {
  const problems = [
    {
      icon: <Clock className="h-8 w-8 text-red-500" />,
      title: "Time-Consuming Process",
      description: "Manual risk assessments take 30+ minutes per compound, eating into patient care time."
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-orange-500" />,
      title: "Error-Prone Manual Work",
      description: "Human errors in data entry and calculations can lead to incorrect risk classifications."
    },
    {
      icon: <FileX className="h-8 w-8 text-red-500" />,
      title: "Compliance Uncertainty",
      description: "Keeping up with changing NAPRA requirements while ensuring full compliance is challenging."
    }
  ];

  const solutions = [
    {
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      title: "Instant Assessment",
      description: "Complete risk assessments in under 2 minutes with automated data retrieval and analysis."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: "Automated Accuracy",
      description: "Eliminate human errors with AI-powered calculations and validated safety databases."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Guaranteed Compliance",
      description: "Always up-to-date with latest NAPRA standards and automated compliance checking."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            The Current Reality vs. Our Solution
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pharmaceutical risk assessments shouldn't be a bottleneck in your workflow
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Problems */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-red-600 mb-2">Current Problems</h3>
              <p className="text-gray-600">What pharmacists face today</p>
            </div>
            
            <div className="space-y-6">
              {problems.map((problem, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm border-l-4 border-red-500">
                  <div className="flex-shrink-0">
                    {problem.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {problem.title}
                    </h4>
                    <p className="text-gray-600">
                      {problem.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-blue-600 mb-2">Our Solution</h3>
              <p className="text-gray-600">How PharmAssess transforms your workflow</p>
            </div>
            
            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                  <div className="flex-shrink-0">
                    {solution.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {solution.title}
                    </h4>
                    <p className="text-gray-600">
                      {solution.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Savings Calculator */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Time Savings Calculator</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold">30 min</div>
                <div className="text-blue-200">Current time per assessment</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-2xl">→</div>
              </div>
              <div>
                <div className="text-3xl font-bold">2 min</div>
                <div className="text-blue-200">With PharmAssess</div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white/10 rounded-lg">
              <div className="text-xl font-semibold">Monthly Savings: 23+ hours</div>
              <div className="text-blue-200">Based on 50 assessments/month</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
