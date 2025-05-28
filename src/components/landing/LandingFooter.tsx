
import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const LandingFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <Pill className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">PharmAssess</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revolutionizing pharmaceutical risk assessment for Canadian pharmacists. 
              NAPRA-compliant reports in under 2 minutes.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>Made with</span>
              <span className="text-red-500">❤️</span>
              <span>in New Brunswick, Canada</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                Features
              </button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                How it Works
              </button>
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                Pricing
              </button>
              <Link 
                to="/app" 
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                Try Demo
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <div className="space-y-2">
              <button className="block text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </button>
              <button className="block text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </button>
              <button className="block text-gray-400 hover:text-white transition-colors text-sm">
                NAPRA Compliance
              </button>
              <button className="block text-gray-400 hover:text-white transition-colors text-sm">
                Data Protection
              </button>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>hello@pharmassess.ca</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <span>1-800-PHARMASSESS</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Fredericton, NB, Canada</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4 pt-2">
              <a 
                href="https://twitter.com/pharmassess" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com/company/pharmassess" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} PharmAssess. All rights reserved.
            </p>
            
            {/* Trust Badges */}
            <div className="flex items-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>NAPRA Compliant</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🔒</span>
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🇨🇦</span>
                <span>Canadian</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
