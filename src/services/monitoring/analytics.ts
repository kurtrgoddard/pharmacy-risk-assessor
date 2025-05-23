
import { SystemHealth, APIHealth, OperationMetrics } from '@/types/api';

interface APICallEvent {
  api: string;
  endpoint: string;
  success: boolean;
  duration: number;
  error?: string;
  timestamp: Date;
}

interface AssessmentEvent {
  compound: string;
  ingredientCount: number;
  riskLevel: string;
  dataQuality: number;
  duration: number;
  timestamp: Date;
}

interface UserActionEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: Date;
}

export class AnalyticsService {
  private apiCalls: APICallEvent[] = [];
  private assessments: AssessmentEvent[] = [];
  private userActions: UserActionEvent[] = [];
  private readonly maxEventAge = 24 * 60 * 60 * 1000; // 24 hours
  private readonly maxEvents = 10000;

  /**
   * Track an API call
   */
  trackAPICall(
    api: string,
    endpoint: string,
    success: boolean,
    duration: number,
    error?: string
  ): void {
    const event: APICallEvent = {
      api,
      endpoint,
      success,
      duration,
      error,
      timestamp: new Date()
    };

    this.apiCalls.push(event);
    this.pruneOldEvents();

    // Log for debugging
    if (!success) {
      console.error(`API call failed: ${api} - ${endpoint}`, error);
    } else if (duration > 5000) {
      console.warn(`Slow API call: ${api} - ${endpoint} took ${duration}ms`);
    }
  }

  /**
   * Track a risk assessment
   */
  trackAssessment(
    compound: string,
    ingredientCount: number,
    riskLevel: string,
    dataQuality: number,
    duration: number
  ): void {
    const event: AssessmentEvent = {
      compound,
      ingredientCount,
      riskLevel,
      dataQuality,
      duration,
      timestamp: new Date()
    };

    this.assessments.push(event);
    this.pruneOldEvents();

    // Log interesting assessments
    if (dataQuality < 0.5) {
      console.warn(`Low quality assessment for ${compound}: ${dataQuality}`);
    }
  }

  /**
   * Track user actions
   */
  trackUserAction(
    action: string,
    category: string,
    label?: string,
    value?: number
  ): void {
    const event: UserActionEvent = {
      action,
      category,
      label,
      value,
      timestamp: new Date()
    };

    this.userActions.push(event);
    this.pruneOldEvents();
  }

  /**
   * Get system health status
   */
  getSystemHealth(): SystemHealth {
    const apis: Record<string, APIHealth> = {};
    const apiGroups = this.groupByAPI();

    for (const [apiName, calls] of Object.entries(apiGroups)) {
      const recentCalls = calls.filter(
        c => Date.now() - c.timestamp.getTime() < 60 * 60 * 1000 // Last hour
      );

      const successfulCalls = recentCalls.filter(c => c.success);
      const successRate = recentCalls.length > 0
        ? successfulCalls.length / recentCalls.length
        : 1;

      const averageLatency = successfulCalls.length > 0
        ? successfulCalls.reduce((sum, c) => sum + c.duration, 0) / successfulCalls.length
        : 0;

      const lastCall = recentCalls[recentCalls.length - 1];

      apis[apiName] = {
        name: apiName,
        status: this.determineAPIStatus(successRate, averageLatency),
        lastCheck: lastCall?.timestamp || new Date(0),
        successRate,
        averageLatency
      };
    }

    // Add APIs that haven't been called yet
    ['PubChem', 'RxNorm', 'DailyMed'].forEach(api => {
      if (!apis[api]) {
        apis[api] = {
          name: api,
          status: 'operational',
          lastCheck: new Date(0),
          successRate: 1,
          averageLatency: 0
        };
      }
    });

    const overall = this.determineOverallHealth(apis);

    return {
      apis,
      cache: this.getCacheHealth(),
      overall
    };
  }

  /**
   * Get operation metrics
   */
  getOperationMetrics(): OperationMetrics[] {
    const metrics: OperationMetrics[] = [];
    const apiGroups = this.groupByAPI();

    for (const [apiName, calls] of Object.entries(apiGroups)) {
      const successfulCalls = calls.filter(c => c.success);
      const failedCalls = calls.filter(c => !c.success);
      
      metrics.push({
        operationName: apiName,
        successRate: calls.length > 0 ? successfulCalls.length / calls.length : 1,
        averageLatency: successfulCalls.length > 0
          ? successfulCalls.reduce((sum, c) => sum + c.duration, 0) / successfulCalls.length
          : 0,
        lastError: failedCalls.length > 0
          ? failedCalls[failedCalls.length - 1].timestamp
          : undefined,
        totalCalls: calls.length
      });
    }

    return metrics;
  }

  /**
   * Get assessment statistics
   */
  getAssessmentStats() {
    const recentAssessments = this.assessments.filter(
      a => Date.now() - a.timestamp.getTime() < 24 * 60 * 60 * 1000
    );

    const riskLevelCounts = recentAssessments.reduce((acc, a) => {
      acc[a.riskLevel] = (acc[a.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageQuality = recentAssessments.length > 0
      ? recentAssessments.reduce((sum, a) => sum + a.dataQuality, 0) / recentAssessments.length
      : 0;

    const averageDuration = recentAssessments.length > 0
      ? recentAssessments.reduce((sum, a) => sum + a.duration, 0) / recentAssessments.length
      : 0;

    return {
      totalAssessments: recentAssessments.length,
      riskLevelDistribution: riskLevelCounts,
      averageDataQuality: averageQuality,
      averageAssessmentTime: averageDuration,
      lowQualityAssessments: recentAssessments.filter(a => a.dataQuality < 0.5).length
    };
  }

  /**
   * Get user activity summary
   */
  getUserActivitySummary() {
    const recentActions = this.userActions.filter(
      a => Date.now() - a.timestamp.getTime() < 24 * 60 * 60 * 1000
    );

    const actionCounts = recentActions.reduce((acc, a) => {
      const key = `${a.category}:${a.action}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalActions: recentActions.length,
      actionBreakdown: actionCounts,
      mostCommonActions: Object.entries(actionCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([action, count]) => ({ action, count }))
    };
  }

  /**
   * Export metrics for external monitoring
   */
  exportMetrics() {
    return {
      timestamp: new Date().toISOString(),
      health: this.getSystemHealth(),
      operations: this.getOperationMetrics(),
      assessments: this.getAssessmentStats(),
      userActivity: this.getUserActivitySummary()
    };
  }

  // Private helper methods
  private pruneOldEvents(): void {
    const cutoffTime = Date.now() - this.maxEventAge;

    this.apiCalls = this.apiCalls.filter(e => e.timestamp.getTime() > cutoffTime);
    this.assessments = this.assessments.filter(e => e.timestamp.getTime() > cutoffTime);
    this.userActions = this.userActions.filter(e => e.timestamp.getTime() > cutoffTime);

    // Also limit total events
    if (this.apiCalls.length > this.maxEvents) {
      this.apiCalls = this.apiCalls.slice(-this.maxEvents);
    }
    if (this.assessments.length > this.maxEvents) {
      this.assessments = this.assessments.slice(-this.maxEvents);
    }
    if (this.userActions.length > this.maxEvents) {
      this.userActions = this.userActions.slice(-this.maxEvents);
    }
  }

  private groupByAPI(): Record<string, APICallEvent[]> {
    return this.apiCalls.reduce((acc, call) => {
      if (!acc[call.api]) {
        acc[call.api] = [];
      }
      acc[call.api].push(call);
      return acc;
    }, {} as Record<string, APICallEvent[]>);
  }

  private determineAPIStatus(
    successRate: number,
    averageLatency: number
  ): 'operational' | 'degraded' | 'down' {
    if (successRate < 0.5) return 'down';
    if (successRate < 0.9 || averageLatency > 5000) return 'degraded';
    return 'operational';
  }

  private determineOverallHealth(
    apis: Record<string, APIHealth>
  ): 'healthy' | 'degraded' | 'unhealthy' {
    const statuses = Object.values(apis).map(api => api.status);
    
    if (statuses.some(s => s === 'down')) return 'unhealthy';
    if (statuses.some(s => s === 'degraded')) return 'degraded';
    return 'healthy';
  }

  private getCacheHealth() {
    // This would integrate with the actual cache manager
    // For now, return mock data
    return {
      hitRate: 0.85,
      size: 1024 * 1024 * 10, // 10MB
      itemCount: 250,
      oldestItem: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    };
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

// Export convenience tracking functions
export function trackAPICall(
  api: string,
  endpoint: string,
  success: boolean,
  duration: number,
  error?: string
): void {
  analyticsService.trackAPICall(api, endpoint, success, duration, error);
}

export function trackAssessment(
  compound: string,
  ingredientCount: number,
  riskLevel: string,
  dataQuality: number,
  duration: number
): void {
  analyticsService.trackAssessment(compound, ingredientCount, riskLevel, dataQuality, duration);
}

export function trackUserAction(
  action: string,
  category: string,
  label?: string,
  value?: number
): void {
  analyticsService.trackUserAction(action, category, label, value);
}
