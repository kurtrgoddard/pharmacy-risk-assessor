
import { SystemHealth, OperationMetrics } from '@/types/api';
import { APICallEvent, AssessmentEvent, UserActionEvent, AnalyticsConfig } from './types';
import { EventManager } from './eventManager';
import { HealthMonitor } from './healthMonitor';
import { MetricsCalculator } from './metricsCalculator';

export class AnalyticsService {
  private eventManager: EventManager;
  private healthMonitor: HealthMonitor;
  private metricsCalculator: MetricsCalculator;

  constructor() {
    const config: AnalyticsConfig = {
      maxEventAge: 24 * 60 * 60 * 1000, // 24 hours
      maxEvents: 10000
    };
    
    this.eventManager = new EventManager(config);
    this.healthMonitor = new HealthMonitor();
    this.metricsCalculator = new MetricsCalculator();
  }

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

    this.eventManager.addAPICall(event);
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

    this.eventManager.addAssessment(event);
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

    this.eventManager.addUserAction(event);
  }

  /**
   * Get system health status
   */
  getSystemHealth(): SystemHealth {
    const apiCallEvents = this.eventManager.getAPICallEvents();
    return this.healthMonitor.generateSystemHealth(apiCallEvents);
  }

  /**
   * Get operation metrics
   */
  getOperationMetrics(): OperationMetrics[] {
    const apiCallEvents = this.eventManager.getAPICallEvents();
    return this.metricsCalculator.calculateOperationMetrics(apiCallEvents);
  }

  /**
   * Get assessment statistics
   */
  getAssessmentStats() {
    const assessmentEvents = this.eventManager.getAssessmentEvents();
    return this.metricsCalculator.calculateAssessmentStats(assessmentEvents);
  }

  /**
   * Get user activity summary
   */
  getUserActivitySummary() {
    const userActionEvents = this.eventManager.getUserActionEvents();
    return this.metricsCalculator.calculateUserActivitySummary(userActionEvents);
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
