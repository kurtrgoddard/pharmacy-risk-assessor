
interface ErrorLogEntry {
  timestamp: string;
  context: string;
  error: string;
  userAgent?: string;
  url?: string;
  userId?: string;
}

class SecureErrorHandler {
  private errorLog: ErrorLogEntry[] = [];
  private maxLogSize = 100;

  logError(error: any, context: string, userId?: string): void {
    const errorEntry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      context,
      error: error instanceof Error ? error.message : String(error),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId
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
        return 'Please check your input and try again. Make sure all required fields are properly filled.';
      case 'network':
        return 'Unable to connect to the service. Please check your internet connection and try again.';
      case 'network_timeout':
        return 'The request timed out. Please check your connection and try again.';
      case 'processing':
        return 'Unable to process your request at this time. Please try again in a few moments.';
      case 'unauthorized':
        return 'You are not authorized to perform this action. Please log in and try again.';
      case 'rate_limited':
        return 'Too many requests. Please wait a moment before trying again.';
      case 'not_found':
        return 'The requested information could not be found. Please verify your input.';
      case 'server_error':
        return 'A server error occurred. Our team has been notified. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
    }
  }

  getUserActionGuidance(context: string): string {
    switch (context) {
      case 'validation':
        return 'Double-check your entries and ensure all required fields are completed correctly.';
      case 'network':
        return 'Check your internet connection and refresh the page to try again.';
      case 'network_timeout':
        return 'Try again with a more stable internet connection.';
      case 'processing':
        return 'Wait a few moments and try your request again.';
      case 'unauthorized':
        return 'Please log in to your account and try again.';
      case 'rate_limited':
        return 'Please wait 1-2 minutes before making another request.';
      case 'not_found':
        return 'Verify the information you entered and try a different search term.';
      case 'server_error':
        return 'Please try again in a few minutes. If the problem continues, contact support.';
      default:
        return 'Try refreshing the page or contact support if you continue to experience issues.';
    }
  }

  handleError(error: any, context: string, userId?: string): never {
    this.logError(error, context, userId);
    const message = `${this.getGenericErrorMessage(context)} ${this.getUserActionGuidance(context)}`;
    throw new Error(message);
  }

  // Safe error reporting that doesn't expose sensitive information
  createSafeErrorReport(error: any, context: string = 'processing'): { 
    message: string; 
    guidance: string;
    timestamp: string;
    canRetry: boolean;
  } {
    return {
      message: this.getGenericErrorMessage(context),
      guidance: this.getUserActionGuidance(context),
      timestamp: new Date().toISOString(),
      canRetry: !['unauthorized', 'validation'].includes(context)
    };
  }

  getErrorStats() {
    const now = Date.now();
    const last24Hours = this.errorLog.filter(entry => 
      now - new Date(entry.timestamp).getTime() < 24 * 60 * 60 * 1000
    );
    
    return {
      total: this.errorLog.length,
      last24Hours: last24Hours.length,
      mostCommonContext: this.getMostCommonContext(),
      recentErrors: this.errorLog.slice(-5)
    };
  }

  private getMostCommonContext(): string {
    const contextCounts = this.errorLog.reduce((acc, entry) => {
      acc[entry.context] = (acc[entry.context] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(contextCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';
  }
}

export const errorHandler = new SecureErrorHandler();

// Enhanced Rate limiting utility
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

  getTimeUntilReset(identifier: string): number {
    const userRequests = this.requests.get(identifier) || [];
    if (userRequests.length === 0) return 0;
    
    const oldestRequest = Math.min(...userRequests);
    const timeUntilReset = this.timeWindow - (Date.now() - oldestRequest);
    
    return Math.max(0, timeUntilReset);
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

// Network connectivity monitoring
export const monitorNetworkConnectivity = (onStatusChange: (isOnline: boolean) => void) => {
  const handleOnline = () => onStatusChange(true);
  const handleOffline = () => onStatusChange(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};
