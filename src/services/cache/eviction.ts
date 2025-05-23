
import { CachedData } from './types';

export class CacheEviction {
  static evictLeastRecentlyUsed(cache: Map<string, CachedData>): void {
    let lruKey: string | null = null;
    let lruTimestamp = Infinity;
    let lruHits = Infinity;

    // Find least recently used item
    for (const [key, value] of cache.entries()) {
      const score = value.timestamp + (value.hits || 0) * 3600000; // 1 hour bonus per hit
      if (score < lruTimestamp + lruHits * 3600000) {
        lruKey = key;
        lruTimestamp = value.timestamp;
        lruHits = value.hits || 0;
      }
    }

    if (lruKey) {
      cache.delete(lruKey);
    }
  }
}
