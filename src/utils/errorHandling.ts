interface ErrorLogEntry {
  timestamp: string;
  context: string;
  error: string;
  userAgent?: string;
  url?: string;
}

class SecureErrorHandler {
  private errorLog: ErrorLogEntry[] = [];
  private maxLogSize = 100;

  logError(error: any, context: string): void {
    const errorEntry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      context,
      error: error instanceof Error ? error.message : String(error),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Add to local log (in production, this would go to a secure logging service)
    this.errorLog.push(errorEntry);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    // Log to console for development (remove in production)
    console.error(`[${context}]`, error);
  }

  getGenericErrorMessage(context: string): string {
    switch (context) {
      case 'validation':
        return 'Please check your input and try again.';
      case 'network':
        return 'Unable to connect to the service. Please try again later.';
      case 'processing':
        return 'Unable to process your request. Please try again.';
      case 'unauthorized':
        return 'You are not authorized to perform this action.';
      default:
        return 'An error occurred. Please try again.';
    }
  }

  handleError(error: any, context: string): never {
    this.logError(error, context);
    throw new Error(this.getGenericErrorMessage(context));
  }

  // Safe error reporting that doesn't expose sensitive information
  createSafeErrorReport(error: any): { message: string; timestamp: string } {
    return {
      message: this.getGenericErrorMessage('processing'),
      timestamp: new Date().toISOString()
    };
  }
}

export const errorHandler = new SecureErrorHandler();

// Rate limiting utility
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests = 10;
  private timeWindow = 60000; // 1 minute

  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the time window
    const recentRequests = userRequests.filter(time => now - time < this.timeWindow);
    
    if (recentRequests.length >= this.maxRequests) {
      return true;
    }
    
    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return false;
  }

  getRemainingRequests(identifier: string): number {
    const userRequests = this.requests.get(identifier) || [];
    const now = Date.now();
    const recentRequests = userRequests.filter(time => now - time < this.timeWindow);
    
    return Math.max(0, this.maxRequests - recentRequests.length);
  }
}

export const rateLimiter = new RateLimiter();

// XSS prevention utility
export const preventXSS = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Safe HTML rendering for display
export const renderSafeHTML = (text: string): string => {
  // Only allow basic formatting, remove all potentially dangerous content
  return preventXSS(text)
    .replace(/\n/g, '<br>')
    .substring(0, 5000); // Limit output length
};
