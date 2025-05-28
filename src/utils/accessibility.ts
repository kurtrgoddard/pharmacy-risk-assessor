
import { logger } from './logger';

// Skip links for keyboard navigation
export const skipToContent = () => {
  const mainContent = document.getElementById('main-content') || document.querySelector('main');
  if (mainContent) {
    mainContent.focus();
    mainContent.scrollIntoView();
    logger.debug('Skipped to main content', undefined, 'Accessibility');
  }
};

// Focus management
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

// Announce to screen readers
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Check for reduced motion preference
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// High contrast mode detection
export const prefersHighContrast = () => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

// Color scheme preference
export const prefersColorScheme = () => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

// WCAG color contrast checker
export const checkColorContrast = (foreground: string, background: string): number => {
  const getLuminance = (color: string): number => {
    // Simplified luminance calculation
    // In production, you'd want a more robust color parsing library
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    
    const [r, g, b] = rgb.map(c => {
      const val = parseInt(c) / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

// Keyboard navigation helpers
export const handleArrowKeyNavigation = (
  e: KeyboardEvent,
  items: NodeListOf<HTMLElement> | HTMLElement[],
  currentIndex: number,
  onIndexChange: (index: number) => void
) => {
  let newIndex = currentIndex;
  
  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      newIndex = (currentIndex + 1) % items.length;
      e.preventDefault();
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      e.preventDefault();
      break;
    case 'Home':
      newIndex = 0;
      e.preventDefault();
      break;
    case 'End':
      newIndex = items.length - 1;
      e.preventDefault();
      break;
    default:
      return;
  }
  
  onIndexChange(newIndex);
  (items[newIndex] as HTMLElement).focus();
};
