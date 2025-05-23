
import { toast } from "@/hooks/use-toast";

export interface FallbackResult<T> {
  success: boolean;
  data: T;
  source: string;
  confidence: number;
  errors?: Error[];
  warning?: string;
}

interface FallbackOperation<T> {
  name: string;
  operation: () => Promise<T>;
  confidence: number;
}

interface OperationStats {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageDuration: number;
  lastFailure: Date | null;
}

export class FallbackHandler {
  private readonly operationStats = new Map<string, OperationStats>();
  
  /**
   * Execute operations with fallback strategy
   */
  async executeWithFallback<T>(
    operations: FallbackOperation<T>[],
    context: string,
    options?: {
      timeout?: number;
      acceptPartial?: boolean;
    }
  ): Promise<FallbackResult<T>> {
    const errors: Error[] = [];
    const startTime = Date.now();

    // Sort operations by confidence (highest first)
    const sortedOperations = [...operations].sort((a, b) => b.confidence - a.confidence);

    for (const op of sortedOperations) {
      try {
        // Apply timeout if specified
        const result = options?.timeout
          ? await this.withTimeout(op.operation(), options.timeout)
          : await op.operation();

        // Track success
        this.recordOperationResult(op.name, true, Date.now() - startTime);

        return {
          success: true,
          data: result,
          source: op.name,
          confidence: op.confidence
        };
      } catch (error) {
        errors.push(error as Error);
        
        // Track failure
        this.recordOperationResult(op.name, false, Date.now() - startTime);
        
        console.error(`${context} - ${op.name} failed:`, error);
      }
    }

    // All operations failed - use safe default
    console.warn(`All operations failed for ${context}, using safe default`);
    
    return {
      success: false,
      data: this.getSafeDefault<T>(context),
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
    options?: {
      minSuccessRate?: number; // Minimum percentage of successful operations required
      timeout?: number;
    }
  ): Promise<FallbackResult<T[]>> {
    const minSuccessRate = options?.minSuccessRate ?? 0.5;
    const results = await Promise.allSettled(
      operations.map(op => 
        options?.timeout 
          ? this.withTimeout(op.operation(), options.timeout)
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
        this.recordOperationResult(operations[index].name, true, 0);
      } else {
        errors.push(result.reason);
        this.recordOperationResult(operations[index].name, false, 0);
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
   * Get safe default values based on context
   */
  private getSafeDefault<T>(context: string): T {
    // Define safe defaults for different contexts
    const safeDefaults: Record<string, any> = {
      'hazard_assessment': {
        ingredientName: 'Unknown',
        riskLevel: 'C', // Highest risk level
        hazardClassifications: {
          ghs: [{
            code: 'DEFAULT',
            category: 'Unknown Hazard',
            description: 'Hazard data unavailable - assume highest risk',
            source: 'System Default'
          }],
          niosh: {
            table: 1,
            category: 'Unknown - Assume Hazardous'
          }
        },
        safetyInfo: {
          handlingPrecautions: [
            'Use maximum PPE including respirator',
            'Handle in certified fume hood only',
            'Minimize exposure time',
            'Consult safety officer before handling'
          ],
          ppeRequirements: [
            { type: 'respirator', specification: 'N95 or higher' },
            { type: 'gloves', specification: 'Double nitrile gloves' },
            { type: 'gown', specification: 'Disposable chemotherapy gown' },
            { type: 'eyewear', specification: 'Safety goggles with face shield' }
          ],
          engineeringControls: [
            'Biological safety cabinet or fume hood required',
            'Negative pressure room recommended',
            'Closed system drug transfer devices required'
          ]
        },
        dataQuality: {
          sources: ['safe_default'],
          confidence: 0.1,
          lastUpdated: new Date(),
          warnings: ['No data available - using maximum safety protocols']
        }
      },
      
      'physical_properties': {
        physicalForm: 'powder', // Most hazardous form
        solubility: 'unknown',
        molecularWeight: null
      },
      
      'risk_level': 'C', // Always default to highest risk
      
      'ppe_requirements': [
        { type: 'respirator', specification: 'N95 minimum' },
        { type: 'gloves', specification: 'Double gloves required' },
        { type: 'gown', specification: 'Protective gown required' },
        { type: 'eyewear', specification: 'Safety glasses minimum' }
      ]
    };

    // Extract base context (remove specific details)
    const baseContext = context.toLowerCase().split(' ').find(word => 
      Object.keys(safeDefaults).some(key => word.includes(key.split('_')[0]))
    ) || 'hazard_assessment';

    const defaultKey = Object.keys(safeDefaults).find(key => 
      baseContext.includes(key.split('_')[0])
    ) || 'hazard_assessment';

    return safeDefaults[defaultKey] as T;
  }

  /**
   * Add timeout to promise
   */
  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);
    });

    return Promise.race([promise, timeout]);
  }

  /**
   * Record operation statistics for monitoring
   */
  private recordOperationResult(operationName: string, success: boolean, duration: number): void {
    const stats = this.operationStats.get(operationName) || {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      averageDuration: 0,
      lastFailure: null
    };

    stats.totalCalls++;
    if (success) {
      stats.successfulCalls++;
    } else {
      stats.failedCalls++;
      stats.lastFailure = new Date();
    }

    // Update average duration
    stats.averageDuration = (stats.averageDuration * (stats.totalCalls - 1) + duration) / stats.totalCalls;

    this.operationStats.set(operationName, stats);
  }

  /**
   * Get operation reliability statistics
   */
  getOperationStats(): Map<string, OperationStats> {
    return new Map(this.operationStats);
  }

  /**
   * Check if an operation is currently reliable
   */
  isOperationReliable(operationName: string, threshold: number = 0.8): boolean {
    const stats = this.operationStats.get(operationName);
    if (!stats || stats.totalCalls < 10) {
      return true; // Not enough data, assume reliable
    }

    const successRate = stats.successfulCalls / stats.totalCalls;
    
    // Also check if there have been recent failures
    if (stats.lastFailure) {
      const timeSinceFailure = Date.now() - stats.lastFailure.getTime();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (timeSinceFailure < fiveMinutes) {
        return false; // Recent failure, consider unreliable
      }
    }

    return successRate >= threshold;
  }

  /**
   * Create a circuit breaker for operations
   */
  createCircuitBreaker<T>(
    operation: () => Promise<T>,
    operationName: string,
    options?: {
      failureThreshold?: number;
      resetTimeout?: number;
    }
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
