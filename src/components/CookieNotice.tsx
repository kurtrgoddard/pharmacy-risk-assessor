
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Cookie, Settings } from 'lucide-react';
import { config, isProduction } from '@/config/environment';
import { logger } from '@/utils/logger';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie-consent';
const COOKIE_PREFERENCES_KEY = 'cookie-preferences';

export const CookieNotice: React.FC = () => {
  const [showNotice, setShowNotice] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    functional: false
  });

  useEffect(() => {
    // Only show cookie notice in production or if analytics are enabled
    if (!isProduction() && !config.analytics.enabled) return;

    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowNotice(true);
    } else {
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      functional: true
    };
    savePreferences(allPreferences);
    setShowNotice(false);
    logger.info('All cookies accepted', allPreferences, 'CookieNotice');
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      functional: false
    };
    savePreferences(necessaryOnly);
    setShowNotice(false);
    logger.info('Only necessary cookies accepted', necessaryOnly, 'CookieNotice');
  };

  const handleSaveSettings = () => {
    savePreferences(preferences);
    setShowNotice(false);
    setShowSettings(false);
    logger.info('Custom cookie preferences saved', preferences, 'CookieNotice');
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);

    // Apply preferences
    if (!prefs.analytics) {
      // Disable analytics tracking
      logger.info('Analytics disabled by user preference', undefined, 'CookieNotice');
    }
  };

  if (!showNotice) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl bg-white border-t shadow-lg">
        <CardContent className="p-6">
          {!showSettings ? (
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Cookie className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    We use cookies to improve your experience
                  </h3>
                  <p className="text-sm text-gray-600">
                    We use necessary cookies to make our site work. We'd also like to set optional cookies 
                    to help us improve our service and analyze site usage. You can customize your preferences 
                    or accept all cookies.
                  </p>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-sm text-blue-600 hover:underline mt-1 flex items-center gap-1"
                  >
                    <Settings className="w-3 h-3" />
                    Customize settings
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={handleAcceptNecessary}
                  className="whitespace-nowrap"
                >
                  Accept Necessary Only
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  className="whitespace-nowrap"
                >
                  Accept All Cookies
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close settings"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Necessary Cookies</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Required for the website to function properly. Cannot be disabled.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.analytics ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                      }`}
                      aria-label={`${preferences.analytics ? 'Disable' : 'Enable'} analytics cookies`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </button>
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Functional Cookies</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Enable enhanced functionality and personalization.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, functional: !prev.functional }))}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.functional ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                      }`}
                      aria-label={`${preferences.functional ? 'Disable' : 'Enable'} functional cookies`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSettings}>
                  Save Preferences
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieNotice;
