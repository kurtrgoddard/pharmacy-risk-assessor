
import { trackAPICall } from '@/services/monitoring/analytics';

export class PubChemHTTPClient {
  private readonly baseURL = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
  private readonly timeout = 10000; // 10 seconds

  async fetchWithTimeout(url: string): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    const startTime = Date.now();
    const endpoint = url.replace(this.baseURL, ''); // Extract endpoint for logging

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      if (!response.ok) {
        const error = `HTTP error! status: ${response.status}`;
        trackAPICall('PubChem', endpoint, false, duration, error);
        throw new Error(error);
      }

      const data = await response.json();
      trackAPICall('PubChem', endpoint, true, duration);
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;
      
      if (error.name === 'AbortError') {
        trackAPICall('PubChem', endpoint, false, duration, 'Request timeout');
        throw new Error('Request timeout');
      }
      
      trackAPICall('PubChem', endpoint, false, duration, error.message);
      throw error;
    }
  }

  getBaseURL(): string {
    return this.baseURL;
  }
}

export const pubchemHttpClient = new PubChemHTTPClient();
