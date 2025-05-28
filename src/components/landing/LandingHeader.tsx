
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Pill } from 'lucide-react';
import { trackUserAction } from '@/services/monitoring/analytics';

interface LandingHeaderProps {
  onDemoClick: () => void;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({ onDemoClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (section: string) => {
    trackUserAction('nav_click', 'landing', section);
    setIsMobileMenuOpen(false);
    
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How it Works' },
    { id: 'pricing', label: 'Pricing' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <Pill className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PharmAssess</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
            <Button 
              variant="outline" 
              onClick={onDemoClick}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Try Demo
            </Button>
            <Button 
              onClick={() => handleNavClick('waitlist')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Join Waitlist
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600 font-medium"
                >
                  {item.label}
                </button>
              ))}
              <div className="px-3 py-2 space-y-2">
                <Button 
                  variant="outline" 
                  onClick={onDemoClick}
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Try Demo
                </Button>
                <Button 
                  onClick={() => handleNavClick('waitlist')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Join Waitlist
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingHeader;
