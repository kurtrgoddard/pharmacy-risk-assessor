
import { toast } from "@/hooks/use-toast";
import { FallbackOperation, FallbackOptions, FallbackResult } from './types';
import { SafeDefaults } from './safeDefaults';
import { TimeoutUtils } from './timeoutUtils';
import { CircuitBreaker } from './circuitBreaker';
import { StatsTracker } from './statsTracker';

export * from './types';

export class FallbackHandler {
  private readonly statsTracker = new StatsTracker();
  
  /**
   * Execute operations with fallback strategy
   */
  async executeWithFallback<T>(
    operations: FallbackOperation<T>[],
    context: string,
    options?: FallbackOptions
  ): Promise<FallbackResult<T>> {
    const errors: Error[] = [];
    const startTime = Date.now();

    // Sort operations by confidence (highest first)
    const sortedOperations = [...operations].sort((a, b) => b.confidence - a.confidence);

    for (const op of sortedOperations) {
      try {
        // Apply timeout if specified
        const result = options?.timeout
          ? await TimeoutUtils.withTimeout(op.operation(), options.timeout)
          : await op.operation();

        // Track success
        this.statsTracker.recordOperationResult(op.name, true, Date.now() - startTime);

        return {
          success: true,
          data: result,
          source: op.name,
          confidence: op.confidence
        };
      } catch (error) {
        errors.push(error as Error);
        
        // Track failure
        this.statsTracker.recordOperationResult(op.name, false, Date.now() - startTime);
        
        console.error(`${context} - ${op.name} failed:`, error);
      }
    }

    // All operations failed - use safe default
    console.warn(`All operations failed for ${context}, using safe default`);
    
    return {
      success: false,
      data: SafeDefaults.getSafeDefault<T>(context),
      source: 'safe_default',
      confidence: 0.1,
      errors,
      warning: 'Using conservative safety defaults due to data unavailability. Manual review recommended.'
    };
  }

  /**
   * Execute multiple operations in parallel with partial success handling
   */
  async executeParallelWithFallback<T>(
    operations: FallbackOperation<T>[],
    context: string,
    options?: FallbackOptions
  ): Promise<FallbackResult<T[]>> {
    const minSuccessRate = options?.minSuccessRate ?? 0.5;
    const results = await Promise.allSettled(
      operations.map(op => 
        options?.timeout 
          ? TimeoutUtils.withTimeout(op.operation(), options.timeout)
          : op.operation()
      )
    );

    const successful: T[] = [];
    const errors: Error[] = [];
    let totalConfidence = 0;
    let successCount = 0;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful.push(result.value);
        totalConfidence += operations[index].confidence;
        successCount++;
        this.statsTracker.recordOperationResult(operations[index].name, true, 0);
      } else {
        errors.push(result.reason);
        this.statsTracker.recordOperationResult(operations[index].name, false, 0);
      }
    });

    const successRate = successCount / operations.length;

    if (successRate >= minSuccessRate) {
      return {
        success: true,
        data: successful,
        source: 'multiple_sources',
        confidence: totalConfidence / successCount,
        errors: errors.length > 0 ? errors : undefined,
        warning: successRate < 1 ? 'Some data sources were unavailable' : undefined
      };
    }

    // Too many failures
    return {
      success: false,
      data: [],
      source: 'insufficient_sources',
      confidence: 0,
      errors,
      warning: `Only ${Math.round(successRate * 100)}% of data sources available. Manual verification required.`
    };
  }

  /**
   * Create a circuit breaker for operations
   */
  createCircuitBreaker<T>(
    operation: () => Promise<T>,
    operationName: string,
    options?: CircuitBreakerOptions
  ): () => Promise<T> {
    return CircuitBreaker.create(operation, operationName, options);
  }

  /**
   * Get operation reliability statistics
   */
  getOperationStats() {
    return this.statsTracker.getOperationStats();
  }

  /**
   * Check if an operation is currently reliable
   */
  isOperationReliable(operationName: string, threshold: number = 0.8): boolean {
    return this.statsTracker.isOperationReliable(operationName, threshold);
  }
}

// Export singleton instance
export const fallbackHandler = new FallbackHandler();

// Export decorator for fallback functionality
export function WithFallback(fallbackConfig: {
  sources: Array<{ name: string; confidence: number }>;
  context: string;
}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const operations: FallbackOperation<any>[] = fallbackConfig.sources.map(source => ({
        name: source.name,
        confidence: source.confidence,
        operation: () => originalMethod.apply(this, args)
      }));

      const result = await fallbackHandler.executeWithFallback(
        operations,
        `${fallbackConfig.context} - ${propertyKey}`
      );

      if (!result.success) {
        console.warn(`Fallback used for ${propertyKey}:`, result.warning);
        toast({
          title: "Data Source Warning",
          description: result.warning,
          variant: "destructive"
        });
      }

      return result.data;
    };

    return descriptor;
  };
}
