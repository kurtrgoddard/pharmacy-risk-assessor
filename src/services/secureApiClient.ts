
import { errorHandler, rateLimiter } from '@/utils/errorHandling';
import { sanitizeObject } from '@/utils/inputValidation';

interface ApiOptions {
  timeout?: number;
  retries?: number;
  requireAuth?: boolean;
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
      errorHandler.handleError(
        new Error('Rate limit exceeded'), 
        'network'
      );
    }

    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      requireAuth = false,
      ...fetchOptions
    } = options;

    // Validate URL to prevent SSRF attacks
    if (!this.isValidUrl(url)) {
      errorHandler.handleError(
        new Error('Invalid URL'), 
        'validation'
      );
    }

    // Sanitize request body if present
    if (fetchOptions.body) {
      try {
        const parsed = JSON.parse(fetchOptions.body as string);
        const sanitized = sanitizeObject(parsed);
        fetchOptions.body = JSON.stringify(sanitized);
      } catch (error) {
        errorHandler.handleError(error, 'validation');
      }
    }

    let lastError: any;
    
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
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return this.sanitizeResponse(data);
        
      } catch (error: any) {
        lastError = error;
        
        if (error.name === 'AbortError') {
          errorHandler.logError(error, 'network_timeout');
        } else {
          errorHandler.logError(error, 'network_request');
        }
        
        // Don't retry on certain errors
        if (error.name === 'AbortError' || error.message?.includes('HTTP 401')) {
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
