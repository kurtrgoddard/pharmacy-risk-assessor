
export interface FallbackResult<T> {
  success: boolean;
  data: T;
  source: string;
  confidence: number;
  errors?: Error[];
  warning?: string;
}

export interface FallbackOperation<T> {
  name: string;
  operation: () => Promise<T>;
  confidence: number;
}

export interface OperationStats {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageDuration: number;
  lastFailure: Date | null;
}

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeout?: number;
}

export interface FallbackOptions {
  timeout?: number;
  acceptPartial?: boolean;
  minSuccessRate?: number;
}
