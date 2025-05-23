
import { CachedData, CacheType, CacheStats, CacheOptions } from './types';
import { MAX_CACHE_SIZE, CLEANUP_INTERVAL } from './config';
import { CacheStatistics } from './statistics';
import { CacheStorage } from './storage';
import { CacheEviction } from './eviction';

export class CacheManager {
  private cache: Map<string, CachedData> = new Map();

  constructor() {
    // Initialize cache from localStorage if available
    this.cache = CacheStorage.loadFromStorage();
    
    // Set up periodic cleanup
    setInterval(() => this.cleanup(), CLEANUP_INTERVAL);
  }

  /**
   * Get or fetch data with caching
   */
  async getOrFetch<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    dataType: CacheType,
    options?: CacheOptions
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
    if (CacheStorage.isExpired(cached, dataType)) {
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
    if (this.cache.size >= MAX_CACHE_SIZE) {
      CacheEviction.evictLeastRecentlyUsed(this.cache);
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
    return CacheStatistics.generateStats(this.cache);
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

  private cleanup(): void {
    let removed = 0;
    
    for (const [key, value] of this.cache.entries()) {
      if (CacheStorage.isExpired(value, value.type)) {
        this.cache.delete(key);
        removed++;
      }
    }
    
    if (removed > 0) {
      console.log(`Cache cleanup: removed ${removed} expired items`);
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    CacheStorage.saveToStorage(this.cache, (dataType) => this.clear(dataType));
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();
