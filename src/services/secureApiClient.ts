import { errorHandler, rateLimiter } from '@/utils/errorHandling';
import { sanitizeObject } from '@/utils/inputValidation';

interface ApiOptions {
  timeout?: number;
  retries?: number;
  requireAuth?: boolean;
}

interface ApiError extends Error {
  code?: string;
  statusCode?: number;
  isNetworkError?: boolean;
  isTimeout?: boolean;
}

class SecureApiClient {
  private readonly defaultTimeout = 10000;
  private readonly defaultRetries = 2;

  async makeSecureRequest<T>(
    url: string, 
    options: RequestInit & ApiOptions = {}
  ): Promise<T> {
    const identifier = this.getRequestIdentifier();
    
    // Check rate limiting
    if (rateLimiter.isRateLimited(identifier)) {
      const error = new Error('Too many requests. Please wait before trying again.') as ApiError;
      error.code = 'RATE_LIMITED';
      errorHandler.handleError(error, 'network');
    }

    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      requireAuth = false,
      ...fetchOptions
    } = options;

    // Validate URL to prevent SSRF attacks
    if (!this.isValidUrl(url)) {
      const error = new Error('Invalid URL provided') as ApiError;
      error.code = 'INVALID_URL';
      errorHandler.handleError(error, 'validation');
    }

    // Sanitize request body if present
    if (fetchOptions.body) {
      try {
        const parsed = JSON.parse(fetchOptions.body as string);
        const sanitized = sanitizeObject(parsed);
        fetchOptions.body = JSON.stringify(sanitized);
      } catch (error) {
        const validationError = new Error('Invalid request data format') as ApiError;
        validationError.code = 'INVALID_REQUEST_FORMAT';
        errorHandler.handleError(validationError, 'validation');
      }
    }

    let lastError: ApiError;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = new Error(this.getHttpErrorMessage(response.status)) as ApiError;
          error.statusCode = response.status;
          error.code = `HTTP_${response.status}`;
          throw error;
        }

        const data = await response.json();
        return this.sanitizeResponse(data);
        
      } catch (error: any) {
        lastError = this.enhanceError(error);
        
        if (error.name === 'AbortError') {
          lastError.isTimeout = true;
          lastError.code = 'TIMEOUT';
          lastError.message = 'Request timed out. Please check your connection and try again.';
          errorHandler.logError(lastError, 'network_timeout');
        } else {
          errorHandler.logError(lastError, 'network_request');
        }
        
        // Don't retry on certain errors
        if (error.name === 'AbortError' || error.message?.includes('HTTP 401') || error.message?.includes('HTTP 403')) {
          break;
        }
        
        // Wait before retry
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }

    errorHandler.handleError(lastError, 'network');
  }

  private enhanceError(error: any): ApiError {
    const enhancedError = error as ApiError;
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      enhancedError.isNetworkError = true;
      enhancedError.code = 'NETWORK_ERROR';
      enhancedError.message = 'Unable to connect to the service. Please check your internet connection.';
    }
    
    return enhancedError;
  }

  private getHttpErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Authentication required. Please log in and try again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'The requested resource could not be found.';
      case 408:
        return 'Request timeout. Please try again.';
      case 429:
        return 'Too many requests. Please wait before trying again.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return `Request failed with status ${status}. Please try again.`;
    }
  }

  private getRequestIdentifier(): string {
    // In a real app, this would use user ID or session ID
    // For now, use a combination of IP simulation and timestamp
    return `${Date.now().toString().slice(-8)}_${Math.random().toString(36).slice(2)}`;
  }

  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      
      // Only allow HTTPS and specific domains
      if (urlObj.protocol !== 'https:') {
        return false;
      }

      // Allow only trusted domains for external APIs
      const trustedDomains = [
        'pubchem.ncbi.nlm.nih.gov',
        'chemspider.com',
        'comptox.epa.gov',
        'ntp.niehs.nih.gov'
      ];

      // For development, also allow localhost
      if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
        return true;
      }

      return trustedDomains.some(domain => urlObj.hostname.endsWith(domain));
    } catch {
      return false;
    }
  }

  private sanitizeResponse<T>(data: any): T {
    if (typeof data === 'object' && data !== null) {
      return sanitizeObject(data) as T;
    }
    return data;
  }
}

export const secureApiClient = new SecureApiClient();
