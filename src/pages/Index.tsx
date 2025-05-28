
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  Clock, 
  FileText, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Building2,
  Zap,
  BookOpen,
  Award
} from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";

const Index = () => {
  const navigate = useNavigate();
  const [showWaitlist, setShowWaitlist] = useState(false);

  const features = [
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "2-Minute Assessments",
      description: "Complete NAPRA-compliant risk assessments in under 2 minutes instead of 30+",
      benefit: "Save 28+ minutes per assessment"
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-green-600" />,
      title: "NAPRA Compliance Built-In",
      description: "Automatic Level A/B/C risk classification following current NAPRA guidelines",
      benefit: "100% regulatory compliance"
    },
    {
      icon: <FileText className="h-8 w-8 text-purple-600" />,
      title: "Professional PDF Reports",
      description: "Generate inspection-ready documentation with all required elements",
      benefit: "Audit-ready documentation"
    },
    {
      icon: <Building2 className="h-8 w-8 text-orange-600" />,
      title: "Real-Time Hazard Data",
      description: "Live integration with PubChem, NIOSH, and Health Canada databases",
      benefit: "Always current safety data"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Clinical Pharmacist, Toronto",
      quote: "PharmAssess has transformed our compounding workflow. What used to take our team 45 minutes now takes less than 3.",
      rating: 5
    },
    {
      name: "Mike Thompson, PharmD",
      role: "Hospital Pharmacy Director, Vancouver",
      quote: "The NAPRA compliance checking gives us confidence that every assessment meets regulatory standards.",
      rating: 5
    }
  ];

  if (showWaitlist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="outline" 
            onClick={() => setShowWaitlist(false)}
            className="mb-6"
          >
            ← Back to Home
          </Button>
          <WaitlistForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-gray-900">PharmAssess</span>
            <Badge variant="secondary">NAPRA Compliant</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/demo')}>
              Try Demo
            </Button>
            <Button onClick={() => setShowWaitlist(true)}>
              Join Waitlist
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-green-100 text-green-800 border-green-300">
            ✅ NAPRA Guidelines 2024 Compliant
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Complete NAPRA Risk Assessments in
            <span className="text-blue-600"> 2 Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            The first AI-powered platform designed specifically for Canadian pharmacists. 
            Generate professional, compliant compound risk assessments with real-time hazard data.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={() => navigate('/demo')} className="bg-blue-600 hover:bg-blue-700">
              <Zap className="mr-2 h-5 w-5" />
              Try Free Demo
            </Button>
            <Button size="lg" variant="outline" onClick={() => setShowWaitlist(true)}>
              Join 500+ Pharmacists on Waitlist
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Time Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">NAPRA Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Pharmacists Waiting</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-red-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Current Risk Assessment Reality
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-red-200">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-red-600 mb-2">30-45 mins</div>
                  <div className="text-gray-600">Per assessment</div>
                </CardContent>
              </Card>
              <Card className="border-red-200">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-red-600 mb-2">Manual Research</div>
                  <div className="text-gray-600">Multiple databases</div>
                </CardContent>
              </Card>
              <Card className="border-red-200">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-red-600 mb-2">Compliance Risk</div>
                  <div className="text-gray-600">Manual errors</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built for Canadian Pharmacists
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for compliant compound risk assessment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {feature.icon}
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-3">
                    {feature.description}
                  </CardDescription>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {feature.benefit}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How PharmAssess Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to complete risk assessment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Enter Compound Details</h3>
              <p className="text-gray-600">Input ingredients, concentrations, and preparation method</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
              <p className="text-gray-600">Real-time hazard lookup and NAPRA risk level assignment</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate Report</h3>
              <p className="text-gray-600">Download professional PDF ready for regulatory review</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Canadian Pharmacists
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <CheckCircle key={i} className="h-5 w-5 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-4 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Risk Assessments?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join 500+ Canadian pharmacists already on our waitlist
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/demo')}>
              <BookOpen className="mr-2 h-5 w-5" />
              Try Free Demo
            </Button>
            <Button size="lg" variant="outline" className="text-blue-600" onClick={() => setShowWaitlist(true)}>
              Join Waitlist - Get 50% Off
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold">PharmAssess</span>
              </div>
              <p className="text-gray-400">
                NAPRA-compliant risk assessment platform for Canadian pharmacists.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Training</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PharmAssess. Made with ❤️ in New Brunswick, Canada.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
