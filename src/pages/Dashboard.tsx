
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  PieChart, 
  Activity, 
  Clock, 
  TrendingUp, 
  Download,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { analyticsService } from '@/services/monitoring/analytics';
import { SystemHealth, OperationMetrics } from '@/types/api';
import MetricsOverview from '@/components/dashboard/MetricsOverview';
import RiskDistributionChart from '@/components/dashboard/RiskDistributionChart';
import TopIngredientsChart from '@/components/dashboard/TopIngredientsChart';
import SystemHealthIndicator from '@/components/dashboard/SystemHealthIndicator';
import DataExportButton from '@/components/dashboard/DataExportButton';

const Dashboard: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [operationMetrics, setOperationMetrics] = useState<OperationMetrics[]>([]);
  const [assessmentStats, setAssessmentStats] = useState<any>(null);
  const [userActivity, setUserActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load all analytics data
        const [health, operations, assessments, activity] = await Promise.all([
          Promise.resolve(analyticsService.getSystemHealth()),
          Promise.resolve(analyticsService.getOperationMetrics()),
          Promise.resolve(analyticsService.getAssessmentStats()),
          Promise.resolve(analyticsService.getUserActivitySummary())
        ]);

        setSystemHealth(health);
        setOperationMetrics(operations);
        setAssessmentStats(assessments);
        setUserActivity(activity);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'unhealthy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'degraded': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'unhealthy': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-pharmacy-neutral p-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-pharmacy-blue" />
              <p className="text-pharmacy-gray">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pharmacy-neutral p-6">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-pharmacy-darkBlue">Analytics Dashboard</h1>
            <p className="text-pharmacy-gray mt-2">Monitor app performance and usage metrics</p>
          </div>
          <div className="flex items-center gap-4">
            {systemHealth && (
              <div className="flex items-center gap-2">
                {getHealthStatusIcon(systemHealth.overall)}
                <span className={`font-medium ${getHealthStatusColor(systemHealth.overall)}`}>
                  System {systemHealth.overall}
                </span>
              </div>
            )}
            <DataExportButton 
              onExport={() => analyticsService.exportMetrics()}
            />
          </div>
        </div>

        {/* System Health Indicator */}
        {systemHealth && (
          <SystemHealthIndicator health={systemHealth} />
        )}

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <MetricsOverview 
              assessmentStats={assessmentStats}
              userActivity={userActivity}
              operationMetrics={operationMetrics}
            />
          </TabsContent>

          <TabsContent value="assessments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {assessmentStats && (
                <RiskDistributionChart 
                  riskDistribution={assessmentStats.riskLevelDistribution}
                />
              )}
              {userActivity && (
                <TopIngredientsChart 
                  userActivity={userActivity}
                />
              )}
            </div>
            
            {assessmentStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Assessment Quality Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {((assessmentStats.averageDataQuality || 0) * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600">Average Data Quality</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(assessmentStats.averageAssessmentTime || 0)}ms
                      </div>
                      <p className="text-sm text-gray-600">Avg Assessment Time</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {assessmentStats.lowQualityAssessments || 0}
                      </div>
                      <p className="text-sm text-gray-600">Low Quality Assessments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {operationMetrics.map((metric) => (
                <Card key={metric.operationName}>
                  <CardHeader>
                    <CardTitle className="text-lg">{metric.operationName} API</CardTitle>
                    <CardDescription>Performance metrics for the last 24 hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Success Rate</span>
                        <Badge variant={metric.successRate > 0.9 ? "default" : "destructive"}>
                          {(metric.successRate * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Average Latency</span>
                        <span className="text-sm">{Math.round(metric.averageLatency)}ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Calls</span>
                        <span className="text-sm">{metric.totalCalls}</span>
                      </div>
                      {metric.lastError && (
                        <div className="text-xs text-red-600">
                          Last error: {metric.lastError.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            {systemHealth && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>API Health Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.values(systemHealth.apis).map((api) => (
                        <div key={api.name} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getHealthStatusIcon(api.status)}
                            <span className="font-medium">{api.name}</span>
                          </div>
                          <div className="text-right text-sm">
                            <div>{(api.successRate * 100).toFixed(1)}% success</div>
                            <div className="text-gray-500">{Math.round(api.averageLatency)}ms avg</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cache Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Hit Rate</span>
                        <Badge variant="default">
                          {(systemHealth.cache.hitRate * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Cache Size</span>
                        <span className="text-sm">
                          {(systemHealth.cache.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Items Cached</span>
                        <span className="text-sm">{systemHealth.cache.itemCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Oldest Item</span>
                        <span className="text-sm">
                          {systemHealth.cache.oldestItem.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
