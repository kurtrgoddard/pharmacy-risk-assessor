
import React, { useEffect } from 'react';
import { skipToContent } from '@/utils/accessibility';
import { Button } from '@/components/ui/button';

export const SkipLinks: React.FC = () => {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <Button
        variant="outline"
        className="absolute top-4 left-4 z-50 bg-white border-2 border-blue-600 focus:ring-2 focus:ring-blue-600"
        onClick={skipToContent}
        onFocus={(e) => {
          e.currentTarget.classList.remove('sr-only');
        }}
        onBlur={(e) => {
          e.currentTarget.classList.add('sr-only');
        }}
      >
        Skip to main content
      </Button>
    </div>
  );
};

export const KeyboardShortcuts: React.FC = () => {
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Alt + M: Skip to main content
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        skipToContent();
      }
      
      // Alt + H: Focus on header/navigation
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        const header = document.querySelector('header') || document.querySelector('nav');
        if (header instanceof HTMLElement) {
          header.focus();
        }
      }
      
      // Escape: Close modals/dropdowns
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
        if (activeModal) {
          const closeButton = activeModal.querySelector('[aria-label*="close"], [aria-label*="Close"]');
          if (closeButton instanceof HTMLElement) {
            closeButton.click();
          }
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  return null; // This component only handles events
};

export default KeyboardShortcuts;
