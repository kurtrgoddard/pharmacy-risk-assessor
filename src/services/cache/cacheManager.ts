
// services/cache/cacheManager.ts
interface CachedData<T = any> {
  data: T;
  timestamp: number;
  type: CacheType;
  source?: string;
  hits?: number;
}

type CacheType = 'pubchem' | 'rxnorm' | 'dailymed' | 'assessment' | 'niosh';

export class CacheManager {
  private cache: Map<string, CachedData> = new Map();
  private readonly maxCacheSize = 1000; // Maximum number of cached items
  
  // TTL configuration in milliseconds
  private readonly TTL_CONFIG: Record<CacheType, number> = {
    pubchem: 7 * 24 * 60 * 60 * 1000,    // 7 days
    rxnorm: 30 * 24 * 60 * 60 * 1000,    // 30 days  
    dailymed: 24 * 60 * 60 * 1000,       // 24 hours
    assessment: 60 * 60 * 1000,           // 1 hour
    niosh: 365 * 24 * 60 * 60 * 1000     // 1 year (updated annually)
  };

  constructor() {
    // Initialize cache from localStorage if available
    this.loadFromStorage();
    
    // Set up periodic cleanup
    setInterval(() => this.cleanup(), 60 * 60 * 1000); // Cleanup every hour
  }

  /**
   * Get or fetch data with caching
   */
  async getOrFetch<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    dataType: CacheType,
    options?: {
      forceRefresh?: boolean;
      source?: string;
    }
  ): Promise<T> {
    const cacheKey = this.createCacheKey(key, dataType);
    
    // Check if we should force refresh
    if (!options?.forceRefresh) {
      const cached = this.get<T>(cacheKey, dataType);
      if (cached !== null) {
        return cached;
      }
    }

    // Fetch new data
    try {
      const data = await fetcher();
      this.set(cacheKey, data, dataType, options?.source);
      return data;
    } catch (error) {
      // If fetch fails, try to return stale cache data
      const staleCached = this.cache.get(cacheKey);
      if (staleCached) {
        console.warn(`Using stale cache for ${key} due to fetch error:`, error);
        return staleCached.data as T;
      }
      throw error;
    }
  }

  /**
   * Get cached data if valid
   */
  get<T>(key: string, dataType: CacheType): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    // Check if expired
    if (this.isExpired(cached, dataType)) {
      this.cache.delete(key);
      return null;
    }

    // Update hit count
    cached.hits = (cached.hits || 0) + 1;
    
    return cached.data as T;
  }

  /**
   * Set cache data
   */
  set<T>(key: string, data: T, dataType: CacheType, source?: string): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      this.evictLeastRecentlyUsed();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      type: dataType,
      source,
      hits: 0
    });

    // Persist to storage
    this.saveToStorage();
  }

  /**
   * Clear all cache or specific type
   */
  clear(dataType?: CacheType): void {
    if (dataType) {
      // Clear only specific type
      for (const [key, value] of this.cache.entries()) {
        if (value.type === dataType) {
          this.cache.delete(key);
        }
      }
    } else {
      // Clear all
      this.cache.clear();
    }
    
    this.saveToStorage();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const stats: CacheStats = {
      totalItems: this.cache.size,
      sizeInBytes: this.estimateCacheSize(),
      itemsByType: {},
      hitRate: 0,
      oldestItem: null,
      newestItem: null
    };

    let totalHits = 0;
    let totalRequests = 0;
    let oldestTimestamp = Infinity;
    let newestTimestamp = 0;

    for (const [key, value] of this.cache.entries()) {
      // Count by type
      stats.itemsByType[value.type] = (stats.itemsByType[value.type] || 0) + 1;
      
      // Track hits
      totalHits += value.hits || 0;
      totalRequests += (value.hits || 0) + 1; // +1 for initial fetch
      
      // Track age
      if (value.timestamp < oldestTimestamp) {
        oldestTimestamp = value.timestamp;
        stats.oldestItem = { key, timestamp: value.timestamp };
      }
      if (value.timestamp > newestTimestamp) {
        newestTimestamp = value.timestamp;
        stats.newestItem = { key, timestamp: value.timestamp };
      }
    }

    stats.hitRate = totalRequests > 0 ? totalHits / totalRequests : 0;
    
    return stats;
  }

  /**
   * Batch get multiple items
   */
  async batchGet<T>(
    keys: string[],
    fetcher: (keys: string[]) => Promise<Map<string, T>>,
    dataType: CacheType
  ): Promise<Map<string, T>> {
    const results = new Map<string, T>();
    const missingKeys: string[] = [];

    // Check cache for each key
    for (const key of keys) {
      const cacheKey = this.createCacheKey(key, dataType);
      const cached = this.get<T>(cacheKey, dataType);
      
      if (cached !== null) {
        results.set(key, cached);
      } else {
        missingKeys.push(key);
      }
    }

    // Fetch missing keys
    if (missingKeys.length > 0) {
      try {
        const fetchedData = await fetcher(missingKeys);
        
        // Cache and add to results
        for (const [key, data] of fetchedData.entries()) {
          const cacheKey = this.createCacheKey(key, dataType);
          this.set(cacheKey, data, dataType);
          results.set(key, data);
        }
      } catch (error) {
        console.error('Batch fetch failed:', error);
      }
    }

    return results;
  }

  // Private methods
  private createCacheKey(key: string, dataType: CacheType): string {
    return `${dataType}:${key.toLowerCase()}`;
  }

  private isExpired(cached: CachedData, dataType: CacheType): boolean {
    const ttl = this.TTL_CONFIG[dataType];
    return Date.now() - cached.timestamp > ttl;
  }

  private cleanup(): void {
    let removed = 0;
    
    for (const [key, value] of this.cache.entries()) {
      if (this.isExpired(value, value.type)) {
        this.cache.delete(key);
        removed++;
      }
    }
    
    if (removed > 0) {
      console.log(`Cache cleanup: removed ${removed} expired items`);
      this.saveToStorage();
    }
  }

  private evictLeastRecentlyUsed(): void {
    let lruKey: string | null = null;
    let lruTimestamp = Infinity;
    let lruHits = Infinity;

    // Find least recently used item
    for (const [key, value] of this.cache.entries()) {
      const score = value.timestamp + (value.hits || 0) * 3600000; // 1 hour bonus per hit
      if (score < lruTimestamp + lruHits * 3600000) {
        lruKey = key;
        lruTimestamp = value.timestamp;
        lruHits = value.hits || 0;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  private estimateCacheSize(): number {
    // Rough estimation of cache size in bytes
    let size = 0;
    
    for (const [key, value] of this.cache.entries()) {
      size += key.length * 2; // UTF-16
      size += JSON.stringify(value.data).length * 2;
      size += 50; // Metadata overhead
    }
    
    return size;
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('pharma_cache');
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Restore cache with type checking
        for (const [key, value] of Object.entries(parsed)) {
          if (this.isValidCachedData(value)) {
            this.cache.set(key, value as CachedData);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load cache from storage:', error);
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Only save non-expired items
      const toSave: Record<string, CachedData> = {};
      
      for (const [key, value] of this.cache.entries()) {
        if (!this.isExpired(value, value.type)) {
          toSave[key] = value;
        }
      }
      
      localStorage.setItem('pharma_cache', JSON.stringify(toSave));
    } catch (error) {
      console.error('Failed to save cache to storage:', error);
      
      // If storage is full, clear old data
      if (error.name === 'QuotaExceededError') {
        this.clear('assessment'); // Clear shortest TTL items first
        try {
          localStorage.setItem('pharma_cache', JSON.stringify({}));
        } catch {
          // Give up on persistence
        }
      }
    }
  }

  private isValidCachedData(value: any): value is CachedData {
    return (
      value &&
      typeof value === 'object' &&
      'data' in value &&
      'timestamp' in value &&
      'type' in value &&
      Object.keys(this.TTL_CONFIG).includes(value.type)
    );
  }
}

// Types
interface CacheStats {
  totalItems: number;
  sizeInBytes: number;
  itemsByType: Record<CacheType, number>;
  hitRate: number;
  oldestItem: { key: string; timestamp: number } | null;
  newestItem: { key: string; timestamp: number } | null;
}

// Export singleton instance
export const cacheManager = new CacheManager();

// Export cache decorator for easy use
export function Cacheable(dataType: CacheType) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`;
      
      return cacheManager.getOrFetch(
        cacheKey,
        () => originalMethod.apply(this, args),
        dataType
      );
    };

    return descriptor;
  };
}
