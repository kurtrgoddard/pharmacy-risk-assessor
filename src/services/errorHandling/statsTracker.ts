
import { OperationStats } from './types';

/**
 * Tracks operation statistics for monitoring reliability
 */
export class StatsTracker {
  private readonly operationStats = new Map<string, OperationStats>();

  /**
   * Record operation statistics for monitoring
   */
  recordOperationResult(operationName: string, success: boolean, duration: number): void {
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
}
