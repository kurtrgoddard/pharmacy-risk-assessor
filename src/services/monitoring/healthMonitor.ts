
import { SystemHealth, APIHealth } from '@/types/api';
import { APICallEvent } from './types';

export class HealthMonitor {
  generateSystemHealth(apiCallEvents: APICallEvent[]): SystemHealth {
    const apis: Record<string, APIHealth> = {};
    const apiGroups = this.groupByAPI(apiCallEvents);

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

  private groupByAPI(apiCalls: APICallEvent[]): Record<string, APICallEvent[]> {
    return apiCalls.reduce((acc, call) => {
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
