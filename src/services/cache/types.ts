
export interface CachedData<T = any> {
  data: T;
  timestamp: number;
  type: CacheType;
  source?: string;
  hits?: number;
}

export type CacheType = 'pubchem' | 'rxnorm' | 'dailymed' | 'assessment' | 'niosh';

export interface CacheStats {
  totalItems: number;
  sizeInBytes: number;
  itemsByType: Record<CacheType, number>;
  hitRate: number;
  oldestItem: { key: string; timestamp: number } | null;
  newestItem: { key: string; timestamp: number } | null;
}

export interface CacheOptions {
  forceRefresh?: boolean;
  source?: string;
}
