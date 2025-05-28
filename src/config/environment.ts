
export type Environment = 'development' | 'staging' | 'production';

export const getEnvironment = (): Environment => {
  if (import.meta.env.PROD) {
    // Check if we're on staging domain
    if (window.location.hostname.includes('staging') || 
        window.location.hostname.includes('preview')) {
      return 'staging';
    }
    return 'production';
  }
  return 'development';
};

export const isDevelopment = () => getEnvironment() === 'development';
export const isStaging = () => getEnvironment() === 'staging';
export const isProduction = () => getEnvironment() === 'production';

export const config = {
  environment: getEnvironment(),
  api: {
    timeout: isProduction() ? 10000 : 30000,
    retries: isProduction() ? 3 : 1,
    baseUrl: isProduction() ? '' : '',
  },
  logging: {
    level: isProduction() ? 'error' : 'debug',
    console: !isProduction(),
  },
  analytics: {
    enabled: isProduction(),
  },
  features: {
    debug: isDevelopment(),
    monitoring: isProduction() || isStaging(),
  }
};
