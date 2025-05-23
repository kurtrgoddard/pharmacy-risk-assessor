
export class PubChemHTTPClient {
  private readonly baseURL = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
  private readonly timeout = 10000; // 10 seconds

  async fetchWithTimeout(url: string): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  getBaseURL(): string {
    return this.baseURL;
  }
}

export const pubchemHttpClient = new PubChemHTTPClient();
