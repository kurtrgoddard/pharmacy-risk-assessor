
import { CachedData, CacheType } from './types';
import { TTL_CONFIG, STORAGE_KEY } from './config';

export class CacheStorage {
  static loadFromStorage(): Map<string, CachedData> {
    const cache = new Map<string, CachedData>();
    
    if (typeof window === 'undefined') return cache;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Restore cache with type checking
        for (const [key, value] of Object.entries(parsed)) {
          if (this.isValidCachedData(value)) {
            cache.set(key, value as CachedData);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load cache from storage:', error);
    }
    
    return cache;
  }

  static saveToStorage(cache: Map<string, CachedData>, clearCache?: (dataType: CacheType) => void): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Only save non-expired items
      const toSave: Record<string, CachedData> = {};
      
      for (const [key, value] of cache.entries()) {
        if (!this.isExpired(value, value.type)) {
          toSave[key] = value;
        }
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.error('Failed to save cache to storage:', error);
      
      // If storage is full, clear old data
      if (error.name === 'QuotaExceededError' && clearCache) {
        clearCache('assessment'); // Clear shortest TTL items first
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
        } catch {
          // Give up on persistence
        }
      }
    }
  }

  static isExpired(cached: CachedData, dataType: CacheType): boolean {
    const ttl = TTL_CONFIG[dataType];
    return Date.now() - cached.timestamp > ttl;
  }

  private static isValidCachedData(value: any): value is CachedData {
    return (
      value &&
      typeof value === 'object' &&
      'data' in value &&
      'timestamp' in value &&
      'type' in value &&
      Object.keys(TTL_CONFIG).includes(value.type)
    );
  }
}
