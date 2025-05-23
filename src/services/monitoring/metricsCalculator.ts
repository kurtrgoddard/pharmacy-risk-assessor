
import { OperationMetrics } from '@/types/api';
import { APICallEvent, AssessmentEvent, UserActionEvent } from './types';

export class MetricsCalculator {
  calculateOperationMetrics(apiCallEvents: APICallEvent[]): OperationMetrics[] {
    const metrics: OperationMetrics[] = [];
    const apiGroups = this.groupByAPI(apiCallEvents);

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

  calculateAssessmentStats(assessmentEvents: AssessmentEvent[]) {
    const recentAssessments = assessmentEvents.filter(
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

  calculateUserActivitySummary(userActionEvents: UserActionEvent[]) {
    const recentActions = userActionEvents.filter(
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

  private groupByAPI(apiCalls: APICallEvent[]): Record<string, APICallEvent[]> {
    return apiCalls.reduce((acc, call) => {
      if (!acc[call.api]) {
        acc[call.api] = [];
      }
      acc[call.api].push(call);
      return acc;
    }, {} as Record<string, APICallEvent[]>);
  }
}
