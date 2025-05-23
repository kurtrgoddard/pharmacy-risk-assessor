
import { CacheType } from './types';
import { cacheManager } from './cacheManager';

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
