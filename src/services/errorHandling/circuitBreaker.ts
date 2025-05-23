
import { CircuitBreakerOptions } from './types';

/**
 * Circuit breaker pattern implementation to prevent repeated calls to failing operations
 */
export class CircuitBreaker {
  /**
   * Creates a circuit breaker for operations
   */
  static create<T>(
    operation: () => Promise<T>,
    operationName: string,
    options?: CircuitBreakerOptions
  ): () => Promise<T> {
    const failureThreshold = options?.failureThreshold ?? 5;
    const resetTimeout = options?.resetTimeout ?? 60000; // 1 minute

    let consecutiveFailures = 0;
    let circuitOpen = false;
    let lastFailureTime = 0;

    return async () => {
      // Check if circuit should be reset
      if (circuitOpen && Date.now() - lastFailureTime > resetTimeout) {
        circuitOpen = false;
        consecutiveFailures = 0;
      }

      // If circuit is open, fail fast
      if (circuitOpen) {
        throw new Error(`Circuit breaker open for ${operationName}`);
      }

      try {
        const result = await operation();
        consecutiveFailures = 0; // Reset on success
        return result;
      } catch (error) {
        consecutiveFailures++;
        lastFailureTime = Date.now();

        if (consecutiveFailures >= failureThreshold) {
          circuitOpen = true;
          console.error(`Circuit breaker opened for ${operationName} after ${consecutiveFailures} failures`);
        }

        throw error;
      }
    };
  }
}
