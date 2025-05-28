import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Twitter, Linkedin, Mail, Phone, MapPin, Shield } from 'lucide-react';

const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
              <Pill className="h-6 w-6 mr-2" />
              <span className="font-bold text-xl">PharmAssess</span>
            </Link>
            <p className="mt-2 text-gray-500 text-sm">
              Instant NAPRA-Compliant Compound Risk Assessment
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Company</h4>
              <ul className="text-gray-500 text-sm space-y-2">
                <li>
                  <Link to="/about" className="hover:text-blue-600">About Us</Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-blue-600">Careers</Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-blue-600">Blog</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Support</h4>
              <ul className="text-gray-500 text-sm space-y-2">
                <li>
                  <Link to="/faq" className="hover:text-blue-600">FAQ</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-blue-600">Contact Us</Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-blue-600">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Contact</h4>
              <ul className="text-gray-500 text-sm space-y-2">
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>123 Main St, Anytown</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>info@pharmassess.com</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>(123) 456-7890</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} PharmAssess. All rights reserved.
          </div>
          <div className="mt-4 flex space-x-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-blue-600">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
