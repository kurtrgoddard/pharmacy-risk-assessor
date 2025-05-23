
import { CachedData, CacheStats, CacheType } from './types';

export class CacheStatistics {
  static generateStats(cache: Map<string, CachedData>): CacheStats {
    const stats: CacheStats = {
      totalItems: cache.size,
      sizeInBytes: this.estimateCacheSize(cache),
      itemsByType: {
        pubchem: 0,
        rxnorm: 0,
        dailymed: 0,
        assessment: 0,
        niosh: 0
      },
      hitRate: 0,
      oldestItem: null,
      newestItem: null
    };

    let totalHits = 0;
    let totalRequests = 0;
    let oldestTimestamp = Infinity;
    let newestTimestamp = 0;

    for (const [key, value] of cache.entries()) {
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

  private static estimateCacheSize(cache: Map<string, CachedData>): number {
    // Rough estimation of cache size in bytes
    let size = 0;
    
    for (const [key, value] of cache.entries()) {
      size += key.length * 2; // UTF-16
      size += JSON.stringify(value.data).length * 2;
      size += 50; // Metadata overhead
    }
    
    return size;
  }
}
