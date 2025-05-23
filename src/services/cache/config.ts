
import { CacheType } from './types';

// TTL configuration in milliseconds
export const TTL_CONFIG: Record<CacheType, number> = {
  pubchem: 7 * 24 * 60 * 60 * 1000,    // 7 days
  rxnorm: 30 * 24 * 60 * 60 * 1000,    // 30 days  
  dailymed: 24 * 60 * 60 * 1000,       // 24 hours
  assessment: 60 * 60 * 1000,           // 1 hour
  niosh: 365 * 24 * 60 * 60 * 1000     // 1 year (updated annually)
};

export const MAX_CACHE_SIZE = 1000; // Maximum number of cached items
export const CLEANUP_INTERVAL = 60 * 60 * 1000; // Cleanup every hour
export const STORAGE_KEY = 'pharma_cache';
